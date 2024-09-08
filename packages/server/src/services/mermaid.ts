import Elysia from 'elysia'
import dbConfig from '../../db.config'
import { createErrorResponse, createSuccessResponse, sqlToMermaidER } from '@root/shared'
import { exec } from 'child_process'

export const MermaidService = new Elysia().get('/mermaid/erd', async () => {
    const command = `${dbConfig.gbase.path}/bin/gs_dump -U ${dbConfig.username} -h ${dbConfig.host} -p ${dbConfig.port} -s ${dbConfig.database} --password='${dbConfig.password}'`
    return new Promise((resolve, reject) => {
        const proc = exec(
            command,
            {
                env: {
                    ...process.env,
                    LD_LIBRARY_PATH: `${dbConfig.gbase.path}/lib:${process.env.LD_LIBRARY_PATH || ''}`
                }
            },
            (_, stdout, stderr) => {
                if (stderr) {
                    reject(createErrorResponse(500, stderr))
                } else {
                    try {
                        const _dealed = sqlToMermaidER(stdout)
                        resolve(createSuccessResponse(200, '获取Mermaid ERD Code成功', _dealed))
                    } catch (error) {
                        reject(createErrorResponse(500, error))
                    }
                }
                proc.kill()
            }
        )
    })
})
