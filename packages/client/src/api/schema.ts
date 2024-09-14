import { handleAxiosRequest } from "@root/shared";
import { API_INST } from ".";
import type { DataBaseSqlExecuteResult, Schema, SchemaCreateParams, SchemaQueryParams } from "@root/models";

/**
 * 获取schema
 * @param params 查询参数
 */
export async function getSchemas(params: SchemaQueryParams) {
    return await handleAxiosRequest<Schema[]>(() => API_INST.get('/schemas', {
        params
    }))
}

/**
 * 创建schema
 * @param params 创建参数
 */
export async function createSchema(params: SchemaCreateParams) {
    return await handleAxiosRequest<Schema>(() => API_INST.post('/schemas', params))
}