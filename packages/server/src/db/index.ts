import OpenGauss from 'node-opengauss'
import config from '../../db.config'
import { DataBaseResult } from '@root/models'
const client = new OpenGauss()
client.connect(config)
process.on('exit', client.disconnect)

export const db = {
    /**
     * 执行sql语句
     * @param sql 目标sql
     */
    async execute(sql: string) {
        return new Promise<DataBaseResult<unknown>>((resolve, reject) => {
            client.query(sql, (result: any) => {
                resolve(result)
            })
        })
    }
}
