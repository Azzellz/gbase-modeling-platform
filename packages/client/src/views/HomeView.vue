<template>
    <main class="h-full p-10">
        <h1>欢迎来到南大通用 GBase8c 数据库建模平台!</h1>
        <n-divider title-placement="left">
            <span class="font-bold text-gray">功能介绍</span>
        </n-divider>
        <!-- 功能列表 -->
        <div class="flex flex-col gap-5">
            <div>
                <h2>1. 支持图形化设计表、列、数据类型、主键等功能。</h2>
                <p class="mt-4">交互式设计数据表，更高效</p>
            </div>
            <div>
                <h2>2. 支持设计好的数据表生成对应的建表语句并在数据库中生成表。</h2>
                <p class="mt-4">前后端通过http接口的形式进行交互</p>
            </div>
            <div>
                <h2>3. 支持通过数据库中的表生成图形化的表关系(ER图)。</h2>
                <p class="mt-4">使用mermaid生成对应的ER关系图</p>
            </div>
        </div>
        <n-divider title-placement="left">
            <span class="font-bold text-gray">数据库连接状态</span>
        </n-divider>
        <div class="flex gap-4">
            <n-switch
                v-model:value="dbStore.isReady"
                :loading="!dbStore.isReady"
                :round="false"
                disabled
                size="large"
            >
                <template #checked> 已连接 </template>
                <template #unchecked>
                    {{ !dbStore.isReady ? '正在尝试连接数据库...' : '未连接' }}
                </template>
            </n-switch>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useDBStore } from '@/stores/db'
import { NDivider, useMessage, NSwitch } from 'naive-ui'
import { onBeforeMount } from 'vue'

const dbStore = useDBStore()
const message = useMessage()

onBeforeMount(async () => {
    const result = await dbStore.init()
    if (!result) {
        message.error('连接数据库失败!')
    }
})
</script>
