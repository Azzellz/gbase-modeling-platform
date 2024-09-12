<template>
    <nav class="px-5 h-16 flex items-center justify-between shadow-xl font-bold">
        <span class="text-lg min-w-60">
            <RouterLink to="/">南大通用GBase8c建模平台</RouterLink>
        </span>
        <div class="flex gap-10 mr-10">
            <RouterLink to="/db">数据库</RouterLink>
            <RouterLink to="/modeling">建模</RouterLink>
            <RouterLink to="/erd">关系图</RouterLink>
        </div>
    </nav>
</template>

<script setup lang="ts"></script>
