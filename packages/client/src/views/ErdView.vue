<template>
    <main class="h-full p-10 flex flex-col justify-center">
        <!-- 选择schema -->
        <n-tabs v-model:value="currentSchema" type="line">
            <template #prefix>
                <span class="font-bold">请选择schema: </span>
            </template>
            <n-tab v-for="(schema, index) in dbStore.schemas" :key="index" :name="schema.name">
                {{ schema.name }}
            </n-tab>
        </n-tabs>
        <!-- 展示图 -->
        <MermaidGraph
            v-if="template"
            class="w-full h-full flex justify-center"
            :template="template"
        />
        <n-spin v-else description="加载中..." class="m-auto" />
    </main>
</template>

<script setup lang="ts">
import { API } from '@/api'
import MermaidGraph from '@/components/MermaidGraph.vue'
import { useDBStore } from '@/stores/db'
import { isSuccessResponse } from '@root/shared'
import { useMessage, NSpin, NTabs, NTab } from 'naive-ui'
import { onBeforeMount, ref, watch } from 'vue'

const message = useMessage()
const dbStore = useDBStore()

const firstSchema = dbStore.schemas.length ? dbStore.schemas[0].name : ''
const currentSchema = ref(firstSchema)
watch(currentSchema, async (newSchema) => {
    template.value = ''
    const result = await API.mermaid.getMermaidErdCode(newSchema)
    if (isSuccessResponse(result)) {
        template.value = result.data
    } else {
        message.error('获取erd失败! ' + result.error)
    }
})

//#region erd模板相关

const template = ref('')
onBeforeMount(async () => {
    const result = await API.mermaid.getMermaidErdCode(currentSchema.value)
    if (isSuccessResponse(result)) {
        template.value = result.data
    } else {
        message.error('获取erd失败! ' + result.error)
    }
})

//#endregion
</script>
