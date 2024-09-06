import Elysia from 'elysia'
import { knex as _knex } from 'knex'
import { TabelModels } from '../models/table.model'
import { createErrorResponse, createSuccessResponse } from '@root/shared'

// 初始化knex客户端
const knex = _knex({
    client: 'pg',
    connection: {
        host: '',
        port: 5432,
        user: 'tyee',
        password: 'Abc123!@',
        database: 'testdb'
    },
    pool: {
        min: 0,
        max: 7,
        acquireTimeoutMillis: 300000,
        createTimeoutMillis: 300000,
        destroyTimeoutMillis: 50000,
        idleTimeoutMillis: 300000,
        reapIntervalMillis: 10000,
        createRetryIntervalMillis: 2000
        // propagateCreateError: false
    }
})
knex.raw('SELECT 1')
    .then(() => {
        console.log('Connection successful')
    })
    .catch((err) => {
        console.error('Connection failed', err)
    })

/**
 * 数据库表服务
 */
export const TableService = new Elysia().use(TabelModels).post(
    '/tables',
    async ({ body }) => {
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
            .toSQL()
        return createSuccessResponse(200, '创建成功', {
            sql: sql[0].sql
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
