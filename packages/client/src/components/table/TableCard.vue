<template>
    <n-card class="shadow-sm">
        <template #header>
            <div class="flex justify-around items-center gap-4">
                <span>{{ table.name || '未命名' }}</span>
                <n-divider vertical />
                <span>字符集 {{ table.charset }}</span>
                <n-divider vertical />
                <span>模式 {{ table.schema }}</span>
            </div>
        </template>
        <n-divider style="margin-top: 0px" />
        <n-table striped :single-line="false">
            <thead>
                <tr align="center">
                    <th class="font-bold">列名</th>
                    <th>数据类型</th>
                    <th>主键</th>
                    <th>可空</th>
                    <th>唯一</th>
                    <th>自增</th>
                    <th>默认值</th>
                    <th>注释</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="table.columns.length === 0" align="center">
                    <td>....</td>
                    <td>....</td>
                    <td>....</td>
                    <td>....</td>
                    <td>....</td>
                    <td>....</td>
                    <td>....</td>
                    <td>....</td>
                </tr>
                <tr v-for="column in table.columns" :key="column.name" align="center">
                    <td>{{ column.name }}</td>
                    <td>{{ column.type }}</td>
                    <td>{{ column.primary ? '是' : '否' }}</td>
                    <td>{{ column.notNull ? '否' : '是' }}</td>
                    <td>{{ column.unique ? '是' : '否' }}</td>
                    <td>{{ column.increments ? '是' : '否' }}</td>
                    <td>{{ column.default || '无' }}</td>
                    <td>
                        <n-ellipsis style="max-width: 100px">
                            {{ column.comment || '无' }}
                        </n-ellipsis>
                    </td>
                </tr>
            </tbody>
        </n-table>
    </n-card>
</template>

<script setup lang="ts">
import type { TableCreateParams } from '@root/models'
import { NCard, NTable, NDivider } from 'naive-ui'

defineProps<{
    table: TableCreateParams
}>()
</script>
