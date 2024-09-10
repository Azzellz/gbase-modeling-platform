<template>
    <n-dialog-provider>
        <n-message-provider>
            <main class="flex flex-col h-full overflow-auto">
                <slot name="default"></slot>
            </main>
        </n-message-provider>
    </n-dialog-provider>
</template>

<script setup lang="ts">
import { NMessageProvider, NDialogProvider } from 'naive-ui'
</script>
