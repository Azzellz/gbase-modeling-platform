import Elysia, { t } from "elysia";
import { createErrorResponse, createSuccessResponse } from "@root/shared";
import { DB } from "@/db";
import { Schema } from "@root/models";

export const SchemaService = new Elysia()

SchemaService.get('/schemas', async ({ query: { system } }) => {
    const result = await DB.schema.getSchemas(!!system)
    return createSuccessResponse(200, '获取Schema成功', result)
}, {
    query: t.Object({
        // 是否要获取系统内置的模式
        system: t.Optional(t.BooleanString({ default: false }))
    })
})

SchemaService.delete('/schemas/:name', async ({ params: { name }, query: { cascade } }) => {
    try {
        const result = await DB.schema.deleteSchema(name, cascade)
        return createSuccessResponse(200, '删除Schema成功', result)
    } catch (error) {
        return createErrorResponse(400, error)
    }
}, {
    query: t.Object({
        // 是否级联删除
        cascade: t.Optional(t.BooleanString({ default: false }))
    })
})

SchemaService.post('/schemas', async ({ body }) => {
    try {
        await DB.schema.createSchema(body.name, body.owner)
        const schema: Schema = body
        return createSuccessResponse(200, '创建Schema成功', schema)
    } catch (error) {
        return createErrorResponse(400, error)
    }
}, {
    body: t.Object({
        name: t.String(),
        owner: t.Optional(t.String())
    })
})