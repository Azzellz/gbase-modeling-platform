import type { DataBaseStatus } from '@root/models'
import { API_INST } from '.'
import { handleAxiosRequest } from '@root/shared'

/**
 * 获取数据库状态
 */
export async function getStatus() {
    return await handleAxiosRequest<DataBaseStatus | null>(() => API_INST.get('/status'))
}
