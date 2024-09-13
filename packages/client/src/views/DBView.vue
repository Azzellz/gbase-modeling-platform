<template>
    <main class="p-10">
        <h1>数据库状态</h1>
        <n-statistic label="当前数据库一共有" tabular-nums>
            <div class="flex items-center gap-2">
                <n-number-animation :from="0" :to="dbStore.schemas.length" />
                <span>个模式</span>
                <n-divider vertical />
                <n-number-animation :from="0" :to="dbStore.tables.length" />
                <span>个表</span>
                <n-divider vertical />
                <n-number-animation :from="0" :to="columnCount" />
                <span>个列</span>
            </div>
        </n-statistic>
        <n-divider />
    </main>
</template>

<script setup lang="ts">
import { useDBStore } from '@/stores/db'
import { NDivider, NStatistic, NNumberAnimation } from 'naive-ui'
import { computed } from 'vue'

const dbStore = useDBStore()
const columnCount = computed(() => {
    let count = 0
    dbStore.tables.forEach((table) => {
        count += table.columns.length
    })
    return count
})
</script>
