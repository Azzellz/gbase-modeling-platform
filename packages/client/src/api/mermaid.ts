import { handleAxiosRequest } from "@root/shared";
import { API_INST } from ".";

/**
 * 获取mermaid er图代码
 * @param schema 要查询的模式
 */
export async function getMermaidErdCode(schema: string) {
    return await handleAxiosRequest<string>(() => API_INST.get('/mermaid/erd', {
        params: {
            schema
        }
    }))
}