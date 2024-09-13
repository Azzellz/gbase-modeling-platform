import { DataBaseStatus } from "@root/models"
import { engine } from "./engine"

interface StatusQueryResult {
    db_size: string
    db_version: string
    active_connections: string
    idle_connections: string
    uptime: {
        days: number
        hours: number
        minutes: number
        seconds: number
        milliseconds: number
    }
    tablespace_size: string
}
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

    const result = await engine.execute<StatusQueryResult>(sql)
    const status = result.affectedRows ? result.rows[0] : null
    if (status) {
        const processedStatus: DataBaseStatus = {
            ...status,
            idle_connections: parseInt(status.idle_connections),
            active_connections: parseInt(status.active_connections)
        }
        return processedStatus
    } else {
        return null
    }

}

export const status = {
    getStatus
}