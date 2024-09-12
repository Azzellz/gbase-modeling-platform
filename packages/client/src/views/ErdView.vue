<template>
    <main class="h-full flex justify-center">
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
import { isSuccessResponse } from '@root/shared'
import { useMessage, NSpin } from 'naive-ui'
import { onBeforeMount, ref } from 'vue'

const message = useMessage()
const template = ref('')
onBeforeMount(async () => {
    const result = await API.mermaid.getMermaidErdCode()
    if (isSuccessResponse(result)) {
        template.value = result.data
    } else {
        message.error('获取erd失败! ' + result.error)
    }
})
</script>
