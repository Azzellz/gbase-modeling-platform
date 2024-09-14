import { handleAxiosRequest } from "@root/shared";
import { API_INST } from ".";

export async function authenticate(key: string) {
    return await handleAxiosRequest<string>(() => API_INST.post('/auth', {
        key
    }))
}