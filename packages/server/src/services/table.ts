import Elysia from 'elysia'
import { knex as _knex } from 'knex'
import { TabelModels } from '../models/table.model'
import { createErrorResponse, createSuccessResponse } from '@root/shared'
import { db } from '../db'

// 初始化knex客户端，这里只是单纯用knex的schema功能，所以不需要连接数据库
const knex = _knex({
    client: 'pg'
})

/**
 * 数据库表服务
 */
export const TableService = new Elysia().use(TabelModels).post(
    '/tables',
    async ({ body }) => {
        // 创建表并且生成sql
        const sql = knex.schema
            .createTable(body.name, (table) => {
                body.columns.forEach((column) => {
                    const links = table[column.type](column.name)
                    if (column.increment) {
                        table.increments(column.increment)
                    }
                    if (column.default) {
                        links.defaultTo(column.default)
                    }
                    if (column.notNull) {
                        links.notNullable()
                    }
                    if (column.primary) {
                        links.primary()
                    }
                    if (column.unique) {
                        links.unique()
                    }
                    if (column.comment) {
                        links.comment(column.comment)
                    }
                })
            })
            .toSQL()[0].sql

        // 执行sql
        const result = await db.query(sql)
        return createSuccessResponse(200, '创建成功', {
            sql,
            result
        })
    },
    {
        body: 'create-table',
        error({ code }) {
            if (code === 'VALIDATION') {
                return createErrorResponse(400, '请求参数有误')
            } else {
                return createErrorResponse(400, '创建失败')
            }
        }
    }
)
