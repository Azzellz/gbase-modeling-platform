import { API } from "@/api";
import type { Table, Schema, SchemaQueryParams } from "@root/models";
import { isSuccessResponse } from "@root/shared";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDBStore = defineStore('db-store', () => {
    const isLinking = ref(false)

    const tables = ref<Table[]>([]);
    async function getTables() {
        const result = await API.table.getTables()
        if (isSuccessResponse(result)) {
            tables.value = result.data
        }
        return result
    }

    const schemas = ref<Schema[]>([]);
    async function getSchemas(params: SchemaQueryParams) {
        const result = await API.schema.getSchemas(params)
        if (isSuccessResponse(result)) {
            schemas.value = result.data
        }
        return result
    }

    /**
     * 初始化数据库所需的东西
     * @returns 数据库是否初始化成功
     */
    async function init() {
        const results = await Promise.all([getTables(), getSchemas({ system: false })])
        const isAllReady = results.every((result) => isSuccessResponse(result))
        if (isAllReady) {
            isLinking.value = true
            return true
        } else {
            return false
        }
    }

    return {
        isLinking,
        tables,
        getTables,
        schemas,
        getSchemas,
        init
    }
})