<template>
    <n-card class="max-w-100 m-auto shadow-2xl" title="请输入访问密钥">
        <div class="flex gap-4">
            <n-input v-model:value="authStore.key" placeholder="请输入..." />
            <n-button @click="handleAuthenticate" type="primary">确定</n-button>
        </div>
    </n-card>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { isSuccessResponse } from '@root/shared'
import { NCard, NButton, NInput, useMessage } from 'naive-ui'

const authStore = useAuthStore()
const message = useMessage()
async function handleAuthenticate() {
    const result = await authStore.authenticate()
    if (isSuccessResponse(result)) {
        message.success('认证成功')
    } else {
        console.error(result)
        message.error(result.error)
    }
}
</script>
