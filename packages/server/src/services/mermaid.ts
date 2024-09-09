import Elysia from 'elysia'
import { createSuccessResponse } from '@root/shared'
import { db } from '../db'

export const MermaidService = new Elysia()

MermaidService.get('/mermaid/erd', async () => {
    const queryPK = `
    SELECT
        n.nspname AS schema_name,
        t.relname AS table_name,
        a.attname AS column_name,
        c.conname AS constraint_name
    FROM
        pg_constraint c
    JOIN
        pg_class t ON c.conrelid = t.oid
    JOIN
        pg_namespace n ON t.relnamespace = n.oid
    JOIN
        pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = t.oid
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
        fa.attname AS foreign_column
    FROM
        pg_constraint c
    JOIN
        pg_class t ON c.conrelid = t.oid
    JOIN
        pg_namespace n ON t.relnamespace = n.oid
    JOIN
        pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = t.oid
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
    const primaryKeys = await db.execute(queryPK)
    const foreignKeys = await db.execute(queryFK)
    return createSuccessResponse(200, '获取Mermaid ERD Code成功', { primaryKeys, foreignKeys })
})
