import OpenGauss from 'node-opengauss'
import config from '../../db.config'
const client = new OpenGauss()
client.connect(config)
process.on('exit', client.disconnect)

export const db = {
    async query(sql: string) {
        return new Promise((resolve, reject) => {
            client.query(sql, (result: any) => {
                resolve(result)
            })
        })
    }
}
