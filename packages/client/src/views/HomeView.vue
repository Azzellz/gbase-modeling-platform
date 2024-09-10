<template>
    <main class="h-full p-10">
        <h1>欢迎来到南大通用 GBase8c 数据库建模平台!</h1>
        <n-divider title-placement="left">
            <span class="font-bold text-gray">功能介绍</span>
        </n-divider>
        <!-- 功能列表 -->
        <div class="flex flex-col gap-5">
            <h2>1. 支持图形化设计表、列、数据类型、主键等功能。</h2>
            <h2>2. 支持设计好的数据表生成对应的建表语句并在数据库中生成表。</h2>
            <div>
                <h2>3. 支持通过数据库中的表生成图形化的表关系(ER图)。</h2>
                <p class="my-4">使用mermaid生成对应的ER关系图</p>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { NDivider } from 'naive-ui'
</script>
