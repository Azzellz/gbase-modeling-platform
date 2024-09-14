<script setup lang="ts">
import AppHeader from '@/components/app/AppHeader.vue'
import AppContent from '@/components/app/AppContent.vue'
import AppContainer from '@/components/app/AppContainer.vue'
import AppGuard from '@/components/app/AppGuard.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
// 默认导航到主页
router.replace('/')
const authStore = useAuthStore()
</script>

<template>
    <AppContainer>
        <template v-if="authStore.token">
            <AppHeader></AppHeader>
            <AppContent></AppContent>
        </template>
        <AppGuard v-else></AppGuard>
    </AppContainer>
</template>
