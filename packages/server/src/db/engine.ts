import OpenGauss from 'node-opengauss'
import config from '../../db.config'
import { DataBaseSqlExecuteResult } from '@root/models'

//#region 初始化客户端

const client = new OpenGauss()
client.connect(config).then(() => {
    console.log('数据库连接成功!')
})
process.on('exit', () => {
    try {
        client.disconnect()
        console.log('成功断开数据库连接')
    } catch (error) {
        console.error('断开数据库连接失败: ' + error)
    }
})

//#endregion

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