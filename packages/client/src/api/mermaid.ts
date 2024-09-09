import { handleAxiosRequest } from "@root/shared";
import { API_INST } from ".";

/**
 * 获取mermaid er图代码
 */
export async function getMermaidErdCode() {
    return await handleAxiosRequest<string>(() => API_INST.get('/mermaid/erd'))
}