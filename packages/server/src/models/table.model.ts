import Elysia, { t } from 'elysia'

export const TabelModels = new Elysia().model({
    'query-table': t.Object({
        schema: t.Optional(t.String({ default: 'public' })) // 模式
    }),
    'create-table': t.Object({
        name: t.String(), // 表名
        charset: t.Optional(t.String({ default: 'utf8mb4' })), // 字符集
        schema: t.Optional(t.String({ default: 'public' })), // 模式
        columns: t.Array(
            t.Object({
                name: t.String(), // 字段名
                type: t.Union([
                    t.Literal('string'),
                    t.Literal('integer'),
                    t.Literal('boolean'),
                    t.Literal('bigint'),
                    t.Literal('binary'),
                    t.Literal('date'),
                    t.Literal('dateTime'),
                    t.Literal('decimal'),
                    t.Literal('double'),
                    t.Literal('float'),
                    t.Literal('json'),
                    t.Literal('jsonb')
                ]), // 字段类型
                default: t.Optional(t.Any()), // 默认值
                isNotNull: t.Boolean(), // 是否为空
                isUnique: t.Boolean(), // 是否唯一
                isPrimary: t.Boolean(), // 是否为主键
                isIncrements: t.Boolean(), // 自增的列名
                comment: t.Optional(t.String()), // 注释
                references: t.Optional(t.String()) // 引用的列
            })
        )
    })
})
