import { API } from '@/api'
import type { Table } from '@root/models'
import { isSuccessResponse } from '@root/shared'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTableStore = defineStore('table-store', () => {
    const tables = ref<Table[]>([])
    async function getTables() {
        const result = await API.table.getTables()
        if (isSuccessResponse(result)) {
            tables.value = result.data
        }
        return result
    }

    return {
        tables,
        getTables
    }
})
