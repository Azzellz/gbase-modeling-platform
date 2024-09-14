import { API, API_INST } from "@/api";
import { isSuccessResponse } from "@root/shared";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth-store', () => {
    const key = ref('')
    const token = ref('')
    API_INST.interceptors.request.use((config) => {
        config.headers.set('Authorization', `Bearer ${token.value}`)
        return config
    })
    async function authenticate() {
        const result = await API.auth.authenticate(key.value)
        if (isSuccessResponse(result)) {
            token.value = result.data
        }
        return result
    }
    return {
        key,
        token,
        authenticate
    }
})