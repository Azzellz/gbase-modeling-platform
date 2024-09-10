<template>
    <main class="h-full flex flex-col p-10">
        <h1>创建数据表</h1>
        <n-divider></n-divider>
        <n-form ref="formRef" class="w-2/3" :model="formModel" :rules="formRules">
            <n-form-item label="数据表的名称" path="name">
                <n-input v-model:value="formModel.name" placeholder="请输入数据表名称"></n-input>
            </n-form-item>
            <n-form-item label="数据表的模式" path="schema">
                <n-input v-model:value="formModel.schema" placeholder="请输入数据表模式"></n-input>
            </n-form-item>
            <n-divider>
                <span class="font-bold text-gray">数据表字段</span>
            </n-divider>
            <n-form-item label="创建字段" path="schema">
                <n-input-group>
                    <n-input
                        v-model:value="currentColumn.name"
                        style="width: 33%"
                        placeholder="请输入字段名"
                    />
                    <!-- <n-input
                        v-model:value="currentColumn.length"
                        style="width: 33%"
                        placeholder="请输入字段长度"
                    /> -->
                    <n-select
                        v-model:value="currentColumn.type"
                        :options="columnTypeOptions"
                        style="width: 40%"
                        placeholder="请选择字段数据类型"
                    />
                </n-input-group>
            </n-form-item>
            <n-form-item
                v-for="column in tableColumns"
                :key="column.name"
                :label="column.name"
                :path="column.name"
            >
            </n-form-item>
        </n-form>
    </main>
</template>

<script setup lang="ts">
import type { TableColumnCreateParams } from '@root/models'
import {
    NForm,
    type FormInst,
    type FormRules,
    NFormItem,
    NInput,
    NSelect,
    NDivider,
    NInputGroup
} from 'naive-ui'
import { ref } from 'vue'

const formModel = ref({
    name: '',
    schema: 'public'
})
const formRef = ref<FormInst | null>(null)
const formRules: FormRules = {
    name: {
        required: true,
        trigger: ['blur', 'input'],
        validator(_, value) {
            // 不得空
            if (!value) {
                return new Error('请输入数据表名称')
            }
            // 只能是英文
            if (!/^[a-zA-Z]+$/.test(value)) {
                return new Error('数据表名称只能包含英文字母')
            }
            // 长度在 1 到 20 个字符
            if (value.length < 5 || value.length > 20) {
                return new Error('数据表名称长度在 5 到 20 个字符之间')
            }
            return true
        }
    },
    schema: {
        required: true,
        trigger: ['blur', 'input'],
        validator(_, value) {
            // 不得空
            if (!value) {
                return new Error('请输入数据表模式')
            }
            // 只能是英文
            if (!/^[a-zA-Z]+$/.test(value)) {
                return new Error('数据表模式只能包含英文字母')
            }
            // 长度在 1 到 20 个字符
            if (value.length < 5 || value.length > 20) {
                return new Error('数据表模式长度在 5 到 20 个字符之间')
            }
            return true
        }
    }
}

//#region 创建字段相关

// 当前字段
const currentColumn = ref({
    name: '',
    type: null,
    notNull: true,
    unique: false,
    primary: false,
    increment: false,
    default: null,
    comment: ''
})
// 字段数据类型的选项
const columnTypeOptions = [
    {
        label: '整数',
        value: 'int'
    },
    {
        label: '浮点数',
        value: 'float'
    },
    {
        label: '字符串',
        value: 'varchar'
    },
    {
        label: '日期',
        value: 'date'
    },
    {
        label: '时间',
        value: 'time'
    },
    {
        label: '日期时间',
        value: 'datetime'
    },
    {
        label: '布尔值',
        value: 'boolean'
    }
]
// 数据表的列(字段)
const tableColumns = ref<TableColumnCreateParams[]>([])

//#endregion
</script>
