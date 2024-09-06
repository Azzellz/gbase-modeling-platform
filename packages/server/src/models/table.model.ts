import Elysia, { t } from 'elysia'

export const TabelModels = new Elysia().model({
    'create-table': t.Object({
        name: t.String(), // 表名
        columns: t.Array(
            t.Object({
                name: t.String(), // 字段名
                length: t.Optional(t.Number()), // 字段长度
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
                    t.Literal('jsonb'),
                ]), // 字段类型
                default: t.Optional(t.Any()), // 默认值
                notNull: t.Optional(t.Boolean()), // 是否为空
                unique: t.Optional(t.Boolean()), // 是否唯一
                primary: t.Optional(t.Boolean()), // 是否为主键
                comment: t.Optional(t.String()), // 注释
                increment: t.Optional(t.String()) // 自增的列名
            })
        )
    })
})
