import OpenGauss from 'node-opengauss'
import config from '../../db.config'
import { DataBaseSqlExecuteResult } from '@root/models'

// 初始化客户端
const client = new OpenGauss()
client.connect(config)
process.on('exit', client.disconnect)

/**
 * OpenGauss数据库引擎
 */
export const engine = {
    /**
     * 执行sql语句
     * @param sql 目标sql
     */
    async execute<T = unknown>(sql: string) {
        return new Promise<DataBaseSqlExecuteResult<T>>((resolve) => {
            client.query(sql, (result: Partial<DataBaseSqlExecuteResult<T>>) => {
                resolve({
                    rows: [],
                    affectedRows: 0,
                    ...result,
                })
            })
        })
    }
}