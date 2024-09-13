<template>
    <main class="p-10">
        <div class="flex items-center gap-3">
            <h1>数据库状态</h1>
            <n-button @click="dbStore.getStatus" text circle>
                <n-icon :size="32">
                    <RefreshIcon />
                </n-icon>
            </n-button>
        </div>
        <h3 class="tip">记录于: {{ dayjs().format() }}</h3>
        <n-divider />
        <div class="flex flex-col gap-4">
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
            <div class="flex gap-10">
                <n-statistic label="数据库大小" :value="dbStore.status?.db_size" />
                <n-statistic label="数据表空间大小" :value="dbStore.status?.tablespace_size" />
                <n-statistic label="活跃连接数" tabular-nums>
                    <n-number-animation :from="0" :to="dbStore.status?.active_connections" />
                    <span>个</span>
                </n-statistic>
                <n-statistic label="空闲连接数" tabular-nums>
                    <n-number-animation :from="0" :to="dbStore.status?.idle_connections" />
                    <span>个</span>
                </n-statistic>
                <n-statistic label="已运行时间" tabular-nums>
                    <n-number-animation :from="0" :to="dbStore.status?.uptime.days" />
                    <span>天</span>
                    <n-number-animation :from="0" :to="dbStore.status?.uptime.hours" />
                    <span>小时</span>
                    <n-number-animation :from="0" :to="dbStore.status?.uptime.minutes" />
                    <span>分钟</span>
                </n-statistic>
            </div>
            <n-statistic label="数据库版本">
                <p class="text-sm">{{ dbStore.status?.db_version }}</p>
            </n-statistic>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useDBStore } from '@/stores/db'
import { NDivider, NStatistic, NNumberAnimation, NButton, NIcon } from 'naive-ui'
import { RefreshCircleOutline as RefreshIcon } from '@vicons/ionicons5'
import { computed } from 'vue'
import dayjs from 'dayjs'

const dbStore = useDBStore()
const columnCount = computed(() => {
    let count = 0
    dbStore.tables.forEach((table) => {
        count += table.columns.length
    })
    return count
})
</script>
