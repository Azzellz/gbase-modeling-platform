import Elysia, { t } from "elysia";
import { db } from "../../db";
import { createSuccessResponse } from "@root/shared";

export const SchemaService = new Elysia().delete('/schemas/:name', async ({ params: { name }, query: { cascade } }) => {
    const sql = `DROP SCHEMA ${name} ${cascade ? 'CASCADE' : ''};`
    const result = await db.execute(sql)
    return createSuccessResponse(200, '删除schema成功', result)
}, {
    query: t.Object({
        cascade: t.Optional(t.BooleanString({ default: false }))
    })
})