<template>
    <RouterView v-slot="{ Component }">
        <KeepAlive include="HomeView">
            <component class="h-full" :is="Component" />
        </KeepAlive>
    </RouterView>
</template>
