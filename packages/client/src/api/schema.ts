import { handleAxiosRequest } from "@root/shared";
import { API_INST } from ".";
import type { Schema, SchemaQueryParams } from "@root/models";

/**
 * 获取schema
 * @param system 是否包含系统内置的模式
 */
export async function getSchemas(params: SchemaQueryParams) {
    const result = await handleAxiosRequest<Schema[]>(() => API_INST.get('/schemas', {
        params
    }))
    return result
}