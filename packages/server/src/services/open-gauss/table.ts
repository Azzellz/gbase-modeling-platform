import Elysia from 'elysia'
import { TabelModels } from '../../models/table.model'
import { createErrorResponse, createSuccessResponse } from '@root/shared'
import { DB } from '../../db'

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
        try {
            const tables = await DB.table.getTables(query.schema!)
            return createSuccessResponse(200, '获取数据表及字段信息成功', tables);
        } catch (error) {
            return createErrorResponse(500, '查询数据表及字段信息失败: ' + error);
        }
    },
    {
        query: 'query-table'
    }
);


/**
 * 创建表
 */
TableService.post(
    '/tables',
    async ({ body }) => {
        return createSuccessResponse(200, '创建成功', await DB.table.createTable(body));
    },
    {
        body: 'create-table',
        error({ code }) {
            if (code === 'VALIDATION') {
                return createErrorResponse(400, '请求参数有误');
            } else {
                return createErrorResponse(400, '创建失败');
            }
        }
    }
);