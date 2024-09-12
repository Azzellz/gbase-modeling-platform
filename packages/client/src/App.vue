<script setup lang="ts">
import AppHeader from '@/components/app/AppHeader.vue'
import AppContent from '@/components/app/AppContent.vue'
import AppContainer from '@/components/app/AppContainer.vue'
import router from '@/router'
// 默认导航到主页
router.replace('/')
</script>

<template>
    <AppContainer>
        <AppHeader></AppHeader>
        <AppContent></AppContent>
    </AppContainer>
</template>
