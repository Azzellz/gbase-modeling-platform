import type { TableCreateParams } from '@root/models'
import { API_INST } from '.'
import { handleAxiosRequest } from '@root/shared'

/**
 * 创建表
 * @param params 创建参数
 * @returns 创建表的sql和创建结果
 */
export async function createTable(params: TableCreateParams) {
    return await handleAxiosRequest<{
        sql: string
    }>(() => API_INST.post('/tables', params))
}
