import Elysia, { t } from 'elysia'

export const SchemaModels = new Elysia().model({
    'query-schema': t.Object({
        schema: t.Optional(t.String({ default: 'public' })) // 模式
    }),
})
