import { DataBaseStatus } from "@root/models"
import { engine } from "./engine"

/**
 * 获取数据库状态
 * @returns 数据库状态的快照
 */
export async function getStatus() {
    const sql = `
SELECT 
    (SELECT pg_size_pretty(pg_database_size(current_database())) AS db_size),
    (SELECT count(*) FROM pg_stat_activity WHERE state != 'idle') AS active_connections,
    (SELECT count(*) FROM pg_stat_activity WHERE state = 'idle') AS idle_connections,
    (SELECT version()) AS db_version,
    (SELECT current_timestamp - pg_postmaster_start_time() AS uptime),
    (SELECT pg_size_pretty(pg_tablespace_size('pg_default')) AS tablespace_size);
 `

    const result = await engine.execute<DataBaseStatus>(sql)
    return result
}

export const status = {
    getStatus
}