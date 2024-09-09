import Elysia from 'elysia'
import { TabelModels } from '../models/table.model'
import { createErrorResponse, createSuccessResponse } from '@root/shared'
import { db } from '../db'
import { SchemaBuilder } from '../utils'

/**
 * 数据库表服务
 */
export const TableService = new Elysia().use(TabelModels)

/**
 * 获取当前数据库所有的数据表
 */
TableService.get(
    '/tables',
    async ({ query }) => {
        const sql = `SELECT tablename FROM pg_tables WHERE schemaname='${query.schema}';`
        const result = await db.execute(sql)
        return createSuccessResponse(200, '获取数据表成功', result)
    },
    {
        query: 'query-table'
    }
)

/**
 * 创建表
 */
TableService.post(
    '/tables',
    async ({ body }) => {
        // 创建表并且生成sql
        const sql = SchemaBuilder.createTable(`${body.schema}.${body.name}`, (table) => {
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
                // table.foreign()
            })
        }).toSQL()[0].sql

        // 执行sql
        const result = await db.execute(sql)
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
