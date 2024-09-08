import Elysia from 'elysia'
import dbConfig from '../../db.config'
import { createSuccessResponse } from '@root/shared'

export const MermaidService = new Elysia().get('/mermaid/erd', async () => {
    const result =
        await Bun.$`gs_dump -U ${dbConfig.username} --port=${dbConfig.port} --host=${dbConfig.host} --schema-only ${dbConfig.database} --password='${dbConfig.password}'`

    return createSuccessResponse(200, '获取Mermaid ERD Code成功', result)
})
