import type { DataBaseSqlExecuteResult, Table, TableCreateParams, TableQueryParams } from '@root/models'
import { API_INST } from '.'
import { handleAxiosRequest } from '@root/shared'

/**
 * 创建表
 * @param params 创建参数
 * @returns 创建表的sql和创建结果
 */
export async function createTable(params: TableCreateParams) {
    return await handleAxiosRequest<{
        sql: string,
        result: DataBaseSqlExecuteResult<any>
    }>(() => API_INST.post('/tables', params))
}

/**
 * 获取所有表
 * @param params 查询参数
 * @returns 查询结果
 */
export async function getTables(params?: TableQueryParams) {
    return await handleAxiosRequest<Table[]>(() => API_INST.get('/tables', {
        params
    }))
}
