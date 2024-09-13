<template>
    <main class="flex flex-col p-10">
        <n-tabs type="line" animated>
            <n-tab-pane name="table">
                <template #tab>
                    <h3>创建数据表</h3>
                </template>
                <template #default>
                    <div class="flex max-lg:flex-col gap-10">
                        <TableForm v-model:table="table" @create-table="handleCreateTable" />
                        <!-- 预览 -->
                        <TableCard class="md:w-1/2" :table="table" />
                    </div>
                </template>
            </n-tab-pane>
            <n-tab-pane name="schema">
                <template #tab>
                    <h3>创建模式</h3>
                </template>
            </n-tab-pane>
        </n-tabs>
    </main>
</template>

<script setup lang="ts">
import TableCard from '@/components/table/TableCard.vue'
import type { TableCreateParams } from '@root/models'
import { useMessage, NTabs, NTabPane } from 'naive-ui'
import { ref } from 'vue'
import { useDBStore } from '@/stores/db'
import { isSuccessResponse } from '@root/shared'
import TableForm from '@/components/table/TableForm.vue'

const message = useMessage()
const dbStore = useDBStore()

const table = ref<TableCreateParams>({
    name: '',
    schema: 'public',
    columns: []
})

async function handleCreateTable(params: TableCreateParams) {
    const result = await dbStore.createTable(params)
    if (isSuccessResponse(result) && result.data.result) {
        message.success('创建成功')
    } else {
        console.error(result)
        message.error('创建失败')
    }
}
</script>
