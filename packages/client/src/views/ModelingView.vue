<template>
    <main class="flex flex-col p-10">
        <h1>创建数据表</h1>
        <n-divider></n-divider>
        <div class="flex max-lg:flex-col gap-10">
            <!-- 表单 -->
            <n-form ref="formRef" class="md:w-1/2" :model="formModel" :rules="formRules">
                <!-- 表相关 -->
                <n-grid :cols="12" :x-gap="24">
                    <n-form-item-gi :span="3" label="数据表的名称" path="name">
                        <n-input v-model:value="formModel.name" placeholder="请输入数据表名称" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="3" label="数据表的模式" path="schema">
                        <n-input v-model:value="formModel.schema" placeholder="请输入数据表模式" />
                    </n-form-item-gi>
                    <n-gi class="flex items-center gap-4" :span="6">
                        <n-button
                            :disabled="!isAllowCreateTable"
                            type="success"
                            @click="handleCreateTable"
                        >
                            {{ isAllowCreateTable ? '创建表' : '创建表，但是至少需要一列' }}
                        </n-button>
                        <n-button type="warning" @click="handleResetTable">重置表</n-button>
                    </n-gi>
                </n-grid>

                <n-divider>
                    <span class="font-bold text-gray">创建列</span>
                </n-divider>
                <!-- 列相关 -->
                <n-grid :cols="12" :x-gap="24" :y-gap="12">
                    <!-- 列名 -->
                    <n-form-item-gi :span="4" label="列名" path="column.name">
                        <n-input v-model:value="currentColumn.name" placeholder="请输入列名" />
                    </n-form-item-gi>

                    <!-- 列数据类型 -->
                    <n-form-item-gi :span="4" label="列数据类型" path="column.type">
                        <n-select
                            v-model:value="currentColumn.type"
                            :options="columnTypeOptions"
                            placeholder="请选择列数据类型"
                        />
                    </n-form-item-gi>

                    <!-- 列默认值 -->
                    <n-form-item-gi :span="4" label="列默认值" path="column.default">
                        <n-input
                            v-model:value="currentColumn.default"
                            placeholder="请输入列默认值"
                        />
                    </n-form-item-gi>

                    <n-form-item-gi :span="4" label="外键引用">
                        <n-input
                            v-model:value="currentColumn.references"
                            placeholder="请输入外键引用"
                        />
                    </n-form-item-gi>

                    <!-- 选项组 -->
                    <n-form-item-gi :span="2" label="可空" required>
                        <n-switch
                            :round="false"
                            :disabled="currentColumn.isPrimary"
                            v-model:value="currentColumn.isNotNull"
                        />
                    </n-form-item-gi>

                    <n-form-item-gi :span="2" label="唯一" required>
                        <n-switch :round="false" v-model:value="currentColumn.isUnique" />
                    </n-form-item-gi>

                    <n-form-item-gi :span="2" label="主键" required>
                        <n-switch
                            :round="false"
                            :disabled="currentColumn.isIncrements || currentColumn.isNotNull"
                            v-model:value="currentColumn.isPrimary"
                        />
                    </n-form-item-gi>

                    <n-form-item-gi :span="2" label="自增" required>
                        <n-switch
                            :round="false"
                            :disabled="currentColumn.isPrimary"
                            v-model:value="currentColumn.isIncrements"
                        />
                    </n-form-item-gi>

                    <!-- 列注释 -->
                    <n-form-item-gi :span="12" label="列注释" path="column.comment">
                        <n-input
                            clearable
                            type="textarea"
                            v-model:value="currentColumn.comment"
                            placeholder="请输入列注释"
                        />
                    </n-form-item-gi>

                    <n-form-item-gi :span="6">
                        <n-flex>
                            <n-button type="primary" @click="handleCreateColumn">创建列</n-button>
                            <n-button type="warning" @click="handleResetColumn">重置列</n-button>
                        </n-flex>
                    </n-form-item-gi>
                </n-grid>
            </n-form>
            <!-- 预览 -->
            <div class="md:w-1/2">
                <TableCard :table="formModel" />
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import TableCard from '@/components/table/TableCard.vue'
import type { TableColumnCreateParams, TableCreateParams } from '@root/models'
import {
    type FormInst,
    type FormRules,
    type FormItemRule,
    NForm,
    NInput,
    NSelect,
    NDivider,
    NGrid,
    NFormItemGi,
    NSwitch,
    NButton,
    NFlex,
    NGi,
    useMessage,
    useDialog
} from 'naive-ui'
import { computed, ref } from 'vue'
import { cloneDeep } from 'lodash'
import { useDBStore } from '@/stores/db'
import { isSuccessResponse } from '@root/shared'

const message = useMessage()
const dbStore = useDBStore()
const dialog = useDialog()

//#region 创建数据表相关
const isAllowCreateTable = computed(() => {
    return !!formModel.value.name && formModel.value.columns.length > 0
})

async function handleCreateTable() {
    const result = await dbStore.createTable(formModel.value)
    if (isSuccessResponse(result) && result.data.result) {
        message.success('创建成功')
    } else {
        console.error(result)
        message.error('创建失败')
    }
}

function handleResetTable() {
    formModel.value = cloneDeep(_emptyTable)
    // 当前列的信息也要重置
    handleResetColumn()
}

//#endregion

//#region 创建列相关

// 模板列
const _emptyColumn: TableColumnCreateParams = {
    name: '',
    type: null as any,
    isNotNull: true,
    isUnique: false,
    isPrimary: false,
    isIncrements: false,
    default: null,
    comment: '',
    references: ''
}
// 当前列
const currentColumn = ref(cloneDeep(_emptyColumn))
// 列数据类型的选项
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
        message.success('创建列成功')
    })
}

// 重置当前列
function handleResetColumn() {
    dialog.success({
        title: '重置列的信息',
        content: '你确定？',
        positiveText: '确定',
        negativeText: '不确定',
        maskClosable: false,
        onPositiveClick() {
            currentColumn.value = cloneDeep(_emptyColumn)
            message.success('重置列成功')
        }
    })
}

//#endregion

//#region 表单相关

const _emptyTable = {
    name: '',
    schema: 'public',
    columns: []
}
const formModel = ref<TableCreateParams>(cloneDeep(_emptyTable))
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
                    return new Error(`请输入列名`)
                }
                // 只能是英文
                if (!/^[a-zA-Z]+$/.test(currentColumn.value.name)) {
                    return new Error(`列名只能包含英文字母`)
                }
                // 长度在 1 到 20 个字符
                if (currentColumn.value.name.length < 1 || currentColumn.value.name.length > 20) {
                    return new Error(`列名长度在 1 到 20 个字符之间`)
                }
                // 是否有重复
                if (
                    formModel.value.columns.some(
                        (column) => column.name === currentColumn.value.name
                    )
                ) {
                    return new Error(`列名已存在`)
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
                    return new Error(`请选择列数据类型`)
                } else {
                    return true
                }
            }
        }
    }
}

//#endregion
</script>
