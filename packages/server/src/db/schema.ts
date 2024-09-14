import { Schema } from "@root/models"
import { engine } from "./engine"

/**
 * 删除Schema
 * @param name 目标schema名称
 * @param cascade 是否级联删除
 */
async function deleteSchema(name: string, cascade: boolean = false) {
    const sql = `DROP SCHEMA ${name} ${cascade ? 'CASCADE' : ''};`
    return await engine.execute(sql)
}

/**
 * 获取schema
 * @param includeSystem 是否包含系统内置的schema
 */
async function getSchemas(includeSystem: boolean) {
    const excludes = `
        WHERE schema_name NOT IN
        ('pg_catalog', 'information_schema', 'pg_toast', 'cstore', 'pkg_service',
        'dbe_perf', 'snapshot', 'blockchain', 'dbms_profiler', 'sqladvisor',
        'dbe_pldebugger', 'dbe_pldeveloper', 'dbe_sql_util', 'db4ai', 'dbms_output',
        'dbms_utility', 'utl_file', 'dbms_random', 'oracle', 'dbms_xmldom',
        'dbms_xmlparser', 'dbms_pipe', 'dbms_alert', 'plvdate', 'plvstr', 'plvchr',
        'plvsubst', 'plunit', 'plvlex', 'dbms_assert', 'orafce', 'dbms_rls',
        'utl_tcp', 'utl_smtp', 'compat_tools', 'sys', 'dbms_metadata', 'dbms_job',
        'dbms_lock', 'dbms_application_info', 'dbms_obfuscation_toolkit', 'utl_url',
        'utl_encode', 'utl_raw', 'dbms_lob', 'dbms_snapshot', 'utl_match', 'wmsys',
        'dbms_sql', 'dbms_stats', 'dbms_rowid'
        )
    `
    const sql = `
        SELECT schema_name
        FROM information_schema.schemata
        ${includeSystem ? "" : excludes};
    `
    const result = await engine.execute<{ schema_name: string }>(sql)

    return result.rows.map((row) => {
        const schema: Schema = {
            name: row.schema_name
        }
        return schema
    })
}

/**
 * 创建schema
 * @param name schema名
 * @param owner schema所属用户
 */
async function createSchema(name: string, owner?: string) {
    const sql = `CREATE SCHEMA ${name} ${owner ? `AUTHORIZATION ${owner}` : ''};`
    return await engine.execute(sql)
}

export const schema = {
    deleteSchema,
    getSchemas,
    createSchema
}