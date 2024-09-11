import Elysia, { t } from "elysia";
import { createSuccessResponse } from "@root/shared";
import { DB } from "../../db";

export const SchemaService = new Elysia().delete('/schemas/:name', async ({ params: { name }, query: { cascade } }) => {
    const result = await DB.schema.deleteSchema(name, cascade)
    return createSuccessResponse(200, '删除schema成功', result)
}, {
    query: t.Object({
        cascade: t.Optional(t.BooleanString({ default: false }))
    })
})