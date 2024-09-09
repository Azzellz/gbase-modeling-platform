<script setup lang="ts">
import { useTableStore } from '@/stores/table'
const tableStore = useTableStore()
tableStore.getTables()
</script>

<template>
    <main class="h-full"></main>
</template>
