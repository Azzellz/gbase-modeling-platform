<template>
    <n-card :title="schema.name" class="shadow-sm overflow-auto"></n-card>
</template>

<script setup lang="ts">
import type { Schema } from '@root/models'
import { NCard } from 'naive-ui'
defineProps<{
    schema: Schema
}>()
</script>
