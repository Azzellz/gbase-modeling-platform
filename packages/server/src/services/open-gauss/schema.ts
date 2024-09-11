import Elysia, { t } from "elysia";
import { createSuccessResponse } from "@root/shared";
import { DB } from "../../db";

export const SchemaService = new Elysia()

SchemaService.get('/schemas', async ({ query: { system } }) => {
    const result = await DB.schema.getSchemas(!!system)
    return createSuccessResponse(200, '获取schema成功', result)
}, {
    query: t.Object({
        // 是否要获取系统内置的模式
        system: t.Optional(t.BooleanString({ default: false }))
    })
})

SchemaService.delete('/schemas/:name', async ({ params: { name }, query: { cascade } }) => {
    const result = await DB.schema.deleteSchema(name, cascade)
    return createSuccessResponse(200, '删除schema成功', result)
}, {
    query: t.Object({
        // 是否级联删除
        cascade: t.Optional(t.BooleanString({ default: false }))
    })
})