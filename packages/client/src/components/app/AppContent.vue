<template>
    <RouterView v-slot="{ Component }">
        <KeepAlive include="HomeView">
            <component class="overflow-auto" :style="{ height }" :is="Component" />
        </KeepAlive>
    </RouterView>
</template>

<script lang="ts" setup>
const height = document.body.clientHeight - 64 + 'px'
</script>
