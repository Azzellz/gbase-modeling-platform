import { API } from '@/api'
import { isSuccessResponse } from '@root/shared'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTableStore = defineStore('table-store', () => {
    const tables = ref<string[]>([])
    async function getTables() {
        const result = await API.table.getTables()
        if (isSuccessResponse(result)) {
            tables.value = result.data.rows.map((item) => item.tablename)
        }
        console.log(result)
        return result
    }

    return {
        tables,
        getTables
    }
})
