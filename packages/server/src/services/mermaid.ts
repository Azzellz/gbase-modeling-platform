import Elysia from 'elysia'
import { createSuccessResponse } from '@root/shared'
import { db } from '../db'
import type { ColumnInfo } from '@root/models'
import { SchemaModels } from '../models/schema.model'

// 生成er图关系标签
function getRelationshipLabel(table: string, foreignTable: string): string {
    if (table.includes('order_items') && foreignTable.includes('orders')) {
        return 'contains' // orders contains order_items
    } else if (table.includes('orders') && foreignTable.includes('customers')) {
        return 'places' // orders placed by customers
    } else if (table.includes('order_items') && foreignTable.includes('products')) {
        return 'refers to' // order_items refers to products
    }
    return 'belongs to' // default relationship
}

// 查询所有字段的SQL，包括主键和外键标识
function createAllColumnsQuerySQL(schema: string) {
    return `
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
}

// 生成er图关系代码，包含所有字段，并排除特定表
function generateMermaidERDiagramWithAllColumns(columns: ColumnInfo[]): string {
    let mermaidCode = 'erDiagram\n'

    // Step 1: Generate table definitions with columns and data types
    const tables: { [key: string]: string[] } = {}

    columns.forEach((col) => {
        const { table_name, column_name, data_type, is_primary_key, is_foreign_key } = col

        // 排除带 _unique, _seq, _pkey 后缀的表，以及某些系统表（如 dual, v$ 开头）
        if (
            table_name.endsWith('_unique') ||
            table_name.endsWith('_seq') ||
            table_name.endsWith('_pkey') ||
            table_name.endsWith('_fkey') ||
            table_name === 'dual' ||
            table_name === 'objecttab' ||
            table_name.startsWith('v$')
        ) {
            return // 跳过这些表
        }

        if (!tables[table_name]) {
            tables[table_name] = []
        }

        let columnDefinition = `${data_type} ${column_name}`
        if (is_primary_key) {
            columnDefinition += ' PK'
        }
        if (is_foreign_key) {
            columnDefinition += ' FK'
        }

        tables[table_name].push(columnDefinition)
    })

    // Add table definitions to mermaid code
    for (const table in tables) {
        mermaidCode += `    ${table} {\n`
        tables[table].forEach((column) => {
            mermaidCode += `        ${column}\n`
        })
        mermaidCode += '    }\n'
    }

    // Step 2: Generate foreign key relationships with standard ER labels
    columns
        .filter((col) => col.is_foreign_key && col.foreign_table)
        .forEach((fk) => {
            const { table_name, foreign_table } = fk

            // 同样排除不需要的外键表
            if (
                table_name.endsWith('_unique') ||
                table_name.endsWith('_seq') ||
                table_name === 'dual' ||
                table_name.startsWith('v$')
            ) {
                return // 跳过这些表
            }

            const relationshipLabel = getRelationshipLabel(table_name, foreign_table!)
            mermaidCode += `    ${table_name} ||--o| ${foreign_table} : "${relationshipLabel}"\n`
        })

    return mermaidCode
}

export const MermaidService = new Elysia().use(SchemaModels)
MermaidService.get(
    '/mermaid/erd',
    async ({ query: { schema } }) => {
        // 查询所有字段的sql
        const queryAllColumnsSQL = createAllColumnsQuerySQL(schema!)

        // 执行SQL查询
        const allColumnsResult = await db.execute<ColumnInfo>(queryAllColumnsSQL)

        // 生成 Mermaid ER 图代码
        const code = generateMermaidERDiagramWithAllColumns(allColumnsResult.rows)

        console.log(code)
        return createSuccessResponse(200, '获取Mermaid ERD Code成功', code)
    },
    {
        query: 'query-schema'
    }
)
