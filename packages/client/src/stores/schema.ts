import { API } from "@/api";
import type { Schema, SchemaQueryParams } from "@root/models";
import { isSuccessResponse } from "@root/shared";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSchemaStore = defineStore('schema-store', () => {
    const schemas = ref<Schema[]>([])
    async function getSchemas(params: SchemaQueryParams) {
        const result = await API.schema.getSchemas(params)
        if (isSuccessResponse(result)) {
            schemas.value = result.data
        }
        return result
    }
    return {
        schemas,
        getSchemas
    }
})