import Elysia from 'elysia'
import { createSuccessResponse } from '@root/shared'
import { db } from '../db'
import type { ForeignKey, ColumnInfo } from '@root/models';

// Function to determine relationship labels
function getRelationshipLabel(table: string, foreignTable: string): string {
    if (table.includes("order_items") && foreignTable.includes("orders")) {
        return "contains";  // orders contains order_items
    } else if (table.includes("orders") && foreignTable.includes("customers")) {
        return "places";  // orders placed by customers
    } else if (table.includes("order_items") && foreignTable.includes("products")) {
        return "refers to";  // order_items refers to products
    }
    return "belongs to";  // default relationship
}

function generateMermaidERDiagram(primaryKeys: ColumnInfo[], foreignKeys: ForeignKey[]): string {
    let mermaidCode = "erDiagram\n";

    // Step 1: Generate table definitions with primary keys and data types
    const tables: { [key: string]: string[] } = {};

    primaryKeys.forEach((pk) => {
        const { table_name, column_name, data_type } = pk;
        if (!tables[table_name]) {
            tables[table_name] = [];
        }
        tables[table_name].push(`${data_type} ${column_name} PK`);
    });

    // Add table definitions to mermaid code
    for (const table in tables) {
        mermaidCode += `    ${table} {\n`;
        tables[table].forEach((column) => {
            mermaidCode += `        ${column}\n`;
        });
        mermaidCode += "    }\n";
    }

    // Step 2: Generate foreign key relationships with standard ER labels
    foreignKeys.forEach((fk) => {
        const { table_name, foreign_table, } = fk;
        const relationshipLabel = getRelationshipLabel(table_name, foreign_table);
        mermaidCode += `    ${table_name} ||--o| ${foreign_table} : "${relationshipLabel}"\n`;
    });

    return mermaidCode;
}

export const MermaidService = new Elysia()

MermaidService.get('/mermaid/erd', async () => {
    const queryPK = `
    SELECT
        n.nspname AS schema_name,
        t.relname AS table_name,
        a.attname AS column_name,
        c.conname AS constraint_name,
        pg_type.typname AS data_type
    FROM
        pg_constraint c
    JOIN
        pg_class t ON c.conrelid = t.oid
    JOIN
        pg_namespace n ON t.relnamespace = n.oid
    JOIN
        pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = t.oid
    JOIN
        pg_type ON a.atttypid = pg_type.oid  
    WHERE
        c.contype = 'p'
        AND n.nspname = 'main';
`

    const queryFK = `
    SELECT
        n.nspname AS schema_name,
        t.relname AS table_name,
        a.attname AS column_name,
        c.conname AS constraint_name,
        fns.nspname AS foreign_schema,
        ft.relname AS foreign_table,
        fa.attname AS foreign_column,
        pg_type.typname AS data_type
    FROM
        pg_constraint c
    JOIN
        pg_class t ON c.conrelid = t.oid
    JOIN
        pg_namespace n ON t.relnamespace = n.oid
    JOIN
        pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = t.oid
    JOIN
        pg_type ON a.atttypid = pg_type.oid
    JOIN
        pg_class ft ON c.confrelid = ft.oid
    JOIN
        pg_namespace fns ON ft.relnamespace = fns.oid
    JOIN
        pg_attribute fa ON fa.attnum = ANY(c.confkey) AND fa.attrelid = ft.oid
    WHERE
        c.contype = 'f'
        AND n.nspname = 'main';
`

    const primaryKeysResult = await db.execute<ColumnInfo>(queryPK)
    const foreignKeysResult = await db.execute<ForeignKey>(queryFK)
    const code = generateMermaidERDiagram(primaryKeysResult.rows, foreignKeysResult.rows)
    return createSuccessResponse(200, '获取Mermaid ERD Code成功', code)
})
