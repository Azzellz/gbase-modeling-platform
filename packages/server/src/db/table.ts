import { ColumnInfo, Table, TableColumn, TableColumnDateType, TableCreateParams } from "@root/models";
import { group } from "radash";
import { engine } from "./engine";
import { SchemaBuilder } from "../utils";
import { Knex } from "knex";

interface TableColumnQueryResult {
    schema_name: string;
    table_name: string;
    column_name: string;
    data_type: TableColumnDateType;
    is_not_null: boolean;
    is_primary: boolean;
    is_foreign: boolean;
    is_unique: boolean;
    is_increments: boolean;
    ordinal_position: number;
    foreign_references: string | null;
    column_comment: string | null;
    default: any
}

/**
 * 查询模式下的所有数据表
 * @param schema 目标模式
 * @returns 数据表
 */
async function getTables(schema: string) {
    const sql = `
WITH primary_keys AS (
    SELECT
        conrelid,
        unnest(conkey) AS attnum
    FROM
        pg_constraint
    WHERE
        contype = 'p'
),
foreign_keys AS (
    SELECT
        conrelid,
        unnest(conkey) AS attnum,
        confrelid,
        unnest(confkey) AS confkey
    FROM
        pg_constraint
    WHERE
        contype = 'f'
),
unique_keys AS (
    SELECT
        conrelid,
        unnest(conkey) AS attnum
    FROM
        pg_constraint
    WHERE
        contype = 'u'
),
auto_increments AS (
    SELECT
        a.attrelid,
        a.attnum
    FROM
        pg_class t
    JOIN pg_namespace n ON t.relnamespace = n.oid
    JOIN pg_attribute a ON a.attrelid = t.oid
    WHERE
        a.attnum > 0
        AND a.attisdropped = FALSE
        AND pg_get_serial_sequence(n.nspname || '.' || t.relname, a.attname) IS NOT NULL
)
SELECT 
    n.nspname AS schema_name,
    t.relname AS table_name,
    a.attname AS column_name,
    pg_type.typname AS data_type,
    a.attnotnull AS is_not_null,
    COALESCE(p.attnum IS NOT NULL, FALSE) AS is_primary,
    COALESCE(f.attnum IS NOT NULL, FALSE) AS is_foreign,
    COALESCE(u.attnum IS NOT NULL, FALSE) AS is_unique,
    COALESCE(ai.attnum IS NOT NULL, FALSE) AS is_increments,
    a.attnum AS ordinal_position,
    CASE 
        WHEN f.attnum IS NOT NULL THEN (
            SELECT relname FROM pg_class WHERE oid = f.confrelid
        ) || '(' || (
            SELECT attname FROM pg_attribute WHERE attrelid = f.confrelid AND attnum = f.confkey
        ) || ')'
        ELSE NULL
    END AS foreign_references,
    pg_catalog.col_description(a.attrelid, a.attnum) AS column_comment,
    pg_get_expr(d.adbin, d.adrelid) AS default_value
FROM 
    pg_class t
JOIN 
    pg_namespace n ON t.relnamespace = n.oid
JOIN 
    pg_attribute a ON a.attrelid = t.oid
JOIN 
    pg_type ON a.atttypid = pg_type.oid
LEFT JOIN 
    pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
LEFT JOIN 
    primary_keys p ON t.oid = p.conrelid AND a.attnum = p.attnum
LEFT JOIN 
    foreign_keys f ON t.oid = f.conrelid AND a.attnum = f.attnum
LEFT JOIN 
    unique_keys u ON t.oid = u.conrelid AND a.attnum = u.attnum
LEFT JOIN 
    auto_increments ai ON t.oid = ai.attrelid AND a.attnum = ai.attnum
WHERE 
    t.relkind = 'r'
    AND n.nspname = '${schema}' 
    AND a.attnum > 0
    AND NOT a.attisdropped
ORDER BY 
    schema_name, table_name, ordinal_position;
`

    const result = await engine.execute<TableColumnQueryResult>(sql);
    const tablesMap = group(result.rows, (row) => row.table_name)
    const tables: Table[] = Object.entries(tablesMap).map(([tableName, tableColumns]) => {
        return {
            name: tableName,
            schema: schema!,
            columns: tableColumns?.map((item) => {
                const column: TableColumn = {
                    name: item.column_name,
                    default: item.default,
                    type: item.data_type,
                    comment: item.column_comment,
                    isNotNull: item.is_not_null,
                    isPrimary: item.is_primary,
                    isUnique: item.is_unique,
                    isIncrements: item.is_increments,
                    position: item.ordinal_position
                }
                if (item.foreign_references) {
                    column.references = item.foreign_references
                }
                return column
            }) || []
        }
    })
    return tables

}

/**
 * 创建表
 * @param params 创建参数
 * @returns 建表sql和归并的执行结果
 */
async function createTable(params: TableCreateParams) {
    // 创建表并且生成sql
    const statements = SchemaBuilder.withSchema(params.schema || 'public').createTable(params.name, (table) => {
        // 设置字符集
        if (params.charset) {
            table.charset(params.charset);
        }
        // 添加列
        params.columns.forEach((column) => {
            let links: Knex.ColumnBuilder;
            // 是否自增
            if (column.isIncrements) {
                links = table.increments(column.name); // 创建自增列，自动处理类型和自增
            } else {
                links = table[column.type](column.name); // 正常处理非自增列
            }
            // 默认值
            if (column.default) {
                links.defaultTo(column.default);
            }
            // 是否可空
            if (column.isNotNull) {
                links.notNullable();
            }
            // 是否作为主键
            if (column.isPrimary) {
                links.primary();
            }
            // 是否唯一
            if (column.isUnique) {
                links.unique();
            }
            // 注释
            if (column.comment) {
                links.comment(column.comment);
            }
            // 引用
            if (column.references) {
                links.references(column.references)
            }
        });

    }).toSQL();

    const sqls = statements.map(statement => statement.sql + ';')
    // 执行sql
    const results = await Promise.all(sqls.map(sql => engine.execute(sql)))
    const mergedResult = results.reduce((acc, curr) => {
        if (curr.rows.length > 0) {
            acc.rows = acc.rows.concat(curr.rows);
        }
        acc.affectedRows += curr.affectedRows;
        return acc;
    }, { rows: [], affectedRows: 0 });

    return {
        sql: sqls.join(' '),
        result: mergedResult
    }
}

/**
 * 查询模式下所有表的主键和外键
 * @param schema 目标模式
 * @returns 主键和外键的查询结果
 */
async function getTablesKeys(schema: string) {
    const sql = `
    SELECT
        n.nspname AS schema_name,
        t.relname AS table_name,
        a.attname AS column_name,
        pg_type.typname AS data_type,
        (CASE WHEN c.contype = 'p' THEN true ELSE false END) AS is_primary_key,
        (CASE WHEN c.contype = 'f' THEN true ELSE false END) AS is_foreign_key,
        fns.nspname AS foreign_schema,
        ft.relname AS foreign_table,
        fa.attname AS foreign_column
    FROM
        pg_attribute a
    JOIN
        pg_type ON a.atttypid = pg_type.oid
    JOIN
        pg_class t ON a.attrelid = t.oid
    JOIN
        pg_namespace n ON t.relnamespace = n.oid
    LEFT JOIN
        pg_constraint c ON a.attnum = ANY(c.conkey) AND c.conrelid = t.oid
    LEFT JOIN
        pg_class ft ON c.confrelid = ft.oid
    LEFT JOIN
        pg_namespace fns ON ft.relnamespace = fns.oid
    LEFT JOIN
        pg_attribute fa ON fa.attnum = ANY(c.confkey) AND fa.attrelid = ft.oid
    WHERE
        n.nspname = '${schema}'
        AND a.attnum > 0
        AND NOT a.attisdropped;
    `
    const result = await engine.execute<ColumnInfo>(sql)
    return result
}

export const table = {
    getTables,
    createTable,
    getTablesKeys
}