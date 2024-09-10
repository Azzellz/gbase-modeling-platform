import Elysia from 'elysia'
import { TabelModels } from '../../models/table.model'
import { createErrorResponse, createSuccessResponse } from '@root/shared'
import { db } from '../../db'
import { SchemaBuilder } from '../../utils'
import { Knex } from 'knex'
import { group } from 'radash'
import { Table } from '@root/models'

interface TableQueryResult {
    schema_name: string;
    table_name: string;
    column_name: string;
    data_type: string;
    is_not_null: boolean;
    ordinal_position: number;
    column_comment?: any;
}
/**
 * 数据库表服务
 */
export const TableService = new Elysia().use(TabelModels)
/**
 * 获取当前数据库所有的数据表
 */
TableService.get(
    '/tables',
    async ({ query }) => {
        // SQL 查询，获取指定模式下所有表及其字段信息
        const sql = `
        SELECT 
            n.nspname AS schema_name,
            t.relname AS table_name,
            a.attname AS column_name,
            pg_type.typname AS data_type,
            a.attnotnull AS is_not_null,
            a.attnum AS ordinal_position,
            pg_catalog.col_description(a.attrelid, a.attnum) AS column_comment
        FROM 
            pg_class t
        JOIN 
            pg_namespace n ON t.relnamespace = n.oid
        JOIN 
            pg_attribute a ON a.attrelid = t.oid
        JOIN 
            pg_type ON a.atttypid = pg_type.oid
        WHERE 
            t.relkind = 'r'
            AND n.nspname = '${query.schema}' 
            AND a.attnum > 0
            AND NOT a.attisdropped
        ORDER BY 
            schema_name, table_name, ordinal_position;
        `;

        try {
            const result = await db.execute<TableQueryResult>(sql);
            const tablesMap = group(result.rows, (row) => row.table_name)
            const tables: Table[] = Object.entries(tablesMap).map(([tableName, tableColumns]) => {
                return {
                    name: tableName,
                    schema: query.schema!,
                    columns: tableColumns?.map((item) => {
                        return {
                            name: item.column_name,
                            comment: item.column_comment,
                            type: item.data_type,
                            isNotNull: item.is_not_null,
                            position: item.ordinal_position
                        }
                    }) || []
                }
            })
            return createSuccessResponse(200, '获取数据表及字段信息成功', tables);
        } catch (error) {
            return createErrorResponse(500, '查询数据表及字段信息失败: ' + error);
        }
    },
    {
        query: 'query-table'
    }
);


/**
 * 创建表
 */
TableService.post(
    '/tables',
    async ({ body }) => {
        // 创建表并且生成sql
        const statements = SchemaBuilder.withSchema(body.schema || 'public').createTable(body.name, (table) => {
            // 添加列
            body.columns.forEach((column) => {
                let links: Knex.ColumnBuilder;
                // 是否自增
                if (column.increments) {
                    links = table.increments(column.name); // 创建自增列，自动处理类型和自增
                } else {
                    links = table[column.type](column.name); // 正常处理非自增列
                }

                // 默认值
                if (column.default) {
                    links.defaultTo(column.default);
                }
                // 是否可空
                if (column.notNull) {
                    links.notNullable();
                }
                // 是否作为主键
                if (column.primary) {
                    links.primary();
                }
                // 是否唯一
                if (column.unique) {
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

        const sql = statements.map(statement => statement.sql + ';')
        // 执行sql
        const results = await Promise.all(sql.map(sql => db.execute(sql)))
        const mergedResult = results.reduce((acc, curr) => {
            if (curr.rows.length > 0) {
                acc.rows = acc.rows.concat(curr.rows);
            }
            acc.affectedRows += curr.affectedRows;
            return acc;
        }, { rows: [], affectedRows: 0 });
        return createSuccessResponse(200, '创建成功', {
            sql: sql.join(' '),
            result: mergedResult
        });
    },
    {
        body: 'create-table',
        error({ code }) {
            if (code === 'VALIDATION') {
                return createErrorResponse(400, '请求参数有误');
            } else {
                return createErrorResponse(400, '创建失败');
            }
        }
    }
);