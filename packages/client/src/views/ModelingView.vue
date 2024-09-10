<template>
    <main class="h-full flex flex-col p-10">
        <h1>创建数据表</h1>
        <n-divider></n-divider>
        <div class="flex max-lg:flex-col gap-10">
            <!-- 表单 -->
            <n-form ref="formRef" class="md:w-3/5" :model="formModel" :rules="formRules">
                <n-grid :cols="12" :x-gap="24">
                    <n-form-item-gi :span="6" label="数据表的名称" path="name">
                        <n-input v-model:value="formModel.name" placeholder="请输入数据表名称" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="3" label="数据表的模式" path="schema">
                        <n-input v-model:value="formModel.schema" placeholder="请输入数据表模式" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="3" label="字符集" required>
                        <n-select
                            :options="tableCharsetOptions"
                            v-model:value="formModel.charset"
                        />
                    </n-form-item-gi>
                </n-grid>
                <n-divider style="margin-top: 0px">
                    <span class="font-bold text-gray">创建字段</span>
                </n-divider>
                <n-grid :cols="12" :x-gap="24">
                    <!-- 字段名 -->
                    <n-form-item-gi :span="4" label="字段名" path="column.name">
                        <n-input v-model:value="currentColumn.name" placeholder="请输入字段名" />
                    </n-form-item-gi>

                    <!-- 字段数据类型 -->
                    <n-form-item-gi :span="4" label="字段数据类型" path="column.type">
                        <n-select
                            v-model:value="currentColumn.type"
                            :options="columnTypeOptions"
                            placeholder="请选择字段数据类型"
                        />
                    </n-form-item-gi>

                    <!-- 字段默认值 -->
                    <n-form-item-gi :span="4" label="字段默认值" path="column.default">
                        <n-input
                            v-model:value="currentColumn.default"
                            placeholder="请输入字段默认值"
                        />
                    </n-form-item-gi>

                    <!-- 选项组 -->
                    <n-form-item-gi :span="2" label="可空" required>
                        <n-switch
                            :round="false"
                            :disabled="currentColumn.primary"
                            v-model:value="currentColumn.notNull"
                        />
                    </n-form-item-gi>

                    <n-form-item-gi :span="2" label="唯一" required>
                        <n-switch :round="false" v-model:value="currentColumn.unique" />
                    </n-form-item-gi>

                    <n-form-item-gi :span="2" label="主键" required>
                        <n-switch
                            :round="false"
                            :disabled="currentColumn.increments || currentColumn.notNull"
                            v-model:value="currentColumn.primary"
                        />
                    </n-form-item-gi>

                    <n-form-item-gi :span="2" label="自增" required>
                        <n-switch
                            :round="false"
                            :disabled="currentColumn.primary"
                            v-model:value="currentColumn.increments"
                        />
                    </n-form-item-gi>

                    <!-- 字段注释 -->
                    <n-form-item-gi :span="12" label="字段注释" path="column.comment">
                        <n-input
                            clearable
                            type="textarea"
                            v-model:value="currentColumn.comment"
                            placeholder="请输入字段注释"
                        />
                    </n-form-item-gi>

                    <n-form-item-gi :span="6">
                        <n-flex>
                            <n-button type="primary" @click="handleCreateColumn">创建字段</n-button>
                            <n-button type="warning" @click="handleResetColumn">重置字段</n-button>
                        </n-flex>
                    </n-form-item-gi>
                </n-grid>
            </n-form>
            <!-- 预览 -->
            <div class="md:w-2/5"></div>
        </div>
    </main>
</template>

<script setup lang="ts">
import type { TableCreateParams } from '@root/models'
import {
    NForm,
    type FormInst,
    type FormRules,
    NInput,
    NSelect,
    NDivider,
    NGrid,
    NFormItemGi,
    NSwitch,
    NButton,
    NFlex,
    type FormItemRule,
    useMessage,
    useDialog
} from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const dialog = useDialog()

//#region 创建数据表相关

// 数据表字符集选项
const tableCharsetOptions = [
    {
        label: 'utf8',
        value: 'utf8'
    },
    {
        label: 'utf8mb4',
        value: 'utf8mb4'
    }
]

//#endregion

//#region 创建字段相关

// 模板字段
const _templateColumn = {
    name: '',
    type: null,
    notNull: true,
    unique: false,
    primary: false,
    increments: false,
    default: null,
    comment: ''
}
// 当前字段
const currentColumn = ref({
    ..._templateColumn
})
// 字段数据类型的选项
const columnTypeOptions = [
    {
        label: '整数(integer)',
        value: 'integer'
    },
    {
        label: '大整数(bigint)',
        value: 'bigint'
    },
    {
        label: '十进制(decimal)',
        value: 'decimal'
    },
    {
        label: '二进制(binary)',
        value: 'binary'
    },
    {
        label: '单精度浮点数(float)',
        value: 'float'
    },
    {
        label: '双精度浮点数(double)',
        value: 'double'
    },
    {
        label: '字符串(string)',
        value: 'string'
    },
    {
        label: '布尔值(boolean)',
        value: 'boolean'
    },
    {
        label: '日期(date)',
        value: 'date'
    },
    {
        label: '日期时间(datetime)',
        value: 'datetime'
    },
    {
        label: 'JSON',
        value: 'json'
    },
    {
        label: 'JSONB',
        value: 'jsonb'
    }
]

function handleCreateColumn() {
    formRef.value?.validate((errors) => {
        // 表单验证
        if (errors) {
            return message.error('请完成必填项')
        }
        formModel.value.columns.push({
            ...(currentColumn.value as any)
        })
        message.success('创建字段成功')
    })
}

// 重置当前字段
function handleResetColumn() {
    dialog.success({
        title: '重置字段的信息',
        content: '你确定？',
        positiveText: '确定',
        negativeText: '不确定',
        maskClosable: false,
        onPositiveClick() {
            currentColumn.value = { ..._templateColumn }
            message.success('重置字段成功')
        }
    })
}

//#endregion

//#region 表单相关

const formModel = ref<TableCreateParams>({
    name: '',
    schema: 'public',
    charset: 'utf8mb4',
    columns: []
})
const formRef = ref<FormInst | null>(null)
function createRule(label: string): FormItemRule {
    return {
        required: true,
        trigger: ['blur', 'input'],
        validator(_, value) {
            // 不得空
            if (!value) {
                return new Error(`请输入${label}`)
            }
            // 只能是英文
            if (!/^[a-zA-Z]+$/.test(value)) {
                return new Error(`${label}只能包含英文字母`)
            }
            // 长度在 1 到 20 个字符
            if (value.length < 1 || value.length > 20) {
                return new Error(`${label}长度在 1 到 20 个字符之间`)
            }
            return true
        }
    }
}
const formRules: FormRules = {
    name: createRule('数据表名称'),
    schema: createRule('数据表模式'),
    column: {
        name: {
            required: true,
            trigger: ['blur', 'input'],
            validator() {
                // 不得空
                if (!currentColumn.value.name) {
                    return new Error(`请输入字段名`)
                }
                // 只能是英文
                if (!/^[a-zA-Z]+$/.test(currentColumn.value.name)) {
                    return new Error(`字段名只能包含英文字母`)
                }
                // 长度在 1 到 20 个字符
                if (currentColumn.value.name.length < 1 || currentColumn.value.name.length > 20) {
                    return new Error(`字段名长度在 1 到 20 个字符之间`)
                }
                // 是否有重复
                if (
                    formModel.value.columns.some(
                        (column) => column.name === currentColumn.value.name
                    )
                ) {
                    return new Error(`字段名已存在`)
                }
                return true
            }
        },
        type: {
            required: true,
            trigger: ['blur', 'input'],
            validator() {
                // 不得空
                if (!currentColumn.value.type) {
                    return new Error(`请选择字段数据类型`)
                } else {
                    return true
                }
            }
        }
    }
}

//#endregion
</script>
