<template>
    <!-- 表单 -->
    <n-form ref="formRef" class="md:w-1/2" :model="model" :rules="formRules">
        <!-- 表相关 -->
        <n-grid :cols="12" :x-gap="24">
            <n-form-item-gi :span="3" label="数据表的名称" path="name">
                <n-input v-model:value="model.name" placeholder="请输入数据表名称" />
            </n-form-item-gi>
            <n-form-item-gi :span="3" label="数据表的模式" path="schema">
                <n-select
                    v-model:value="model.schema"
                    :options="schemaOptions"
                    placeholder="请选择数据表模式"
                />
            </n-form-item-gi>
            <n-gi class="flex items-center gap-4" :span="6">
                <n-button :disabled="!isAllowCreateTable" type="success" @click="handleCreateTable">
                    {{ isAllowCreateTable ? '创建表' : '创建表，但是至少需要一列' }}
                </n-button>
                <n-button type="warning" @click="handleResetTable">重置表</n-button>
            </n-gi>
        </n-grid>

        <n-divider style="margin-top: 0px">
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
                <n-input v-model:value="currentColumn.default" placeholder="请输入列默认值" />
            </n-form-item-gi>

            <!-- 外键引用 -->
            <n-form-item-gi :span="4" label="外键引用">
                <n-cascader
                    v-model:value="currentColumn.references"
                    placeholder="请选择外键引用"
                    :options="referencesOptions"
                    check-strategy="child"
                    expand-trigger="hover"
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
</template>

<script setup lang="ts">
import type { Schema, Table, TableColumnCreateParams, TableCreateParams } from '@root/models'
import {
    type FormInst,
    type FormRules,
    NForm,
    NCascader,
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

//#region 组件上下文相关

const model = defineModel<TableCreateParams>('model', { required: true })
const emits = defineEmits<{
    'create-table': [params: TableCreateParams]
}>()
const props = defineProps<{
    schemas: Schema[]
    tables: Table[]
}>()

const message = useMessage()
const dialog = useDialog()

//#endregion

//#region 根据props计算的选项相关

const schemaOptions = computed(() => {
    return props.schemas.map(({ name }) => ({
        label: name,
        value: name
    }))
})
const referencesOptions = computed(() => {
    return props.schemas.map((schema) => {
        return {
            label: schema.name,
            value: schema.name,
            children: props.tables
                .filter((table) => table.schema === schema.name)
                .filter((table) => table.columns.some((column) => column.isUnique))
                .map((table) => ({
                    label: table.name,
                    value: table.name,
                    children: table.columns
                        .filter((column) => column.isUnique)
                        .map((column) => ({
                            label: column.name,
                            value: `${schema.name}.${table.name}.${column.name}`
                        }))
                }))
        }
    })
})

//#endregion

//#region 创建数据表相关

const isAllowCreateTable = computed(() => {
    return !!model.value.name && model.value.columns.length > 0
})

async function handleCreateTable() {
    emits('create-table', model.value)
}

function handleResetTable() {
    model.value = cloneDeep(_emptyTable)
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
    references: null as any
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
        model.value.columns.push({
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
const formRef = ref<FormInst | null>(null)

//#region 表单校验相关

// PostgreSQL合法命名正则表达式
const nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/
// PostgreSQL保留关键字
const reservedWords = [
    'ALL',
    'ANALYSE',
    'ANALYZE',
    'AND',
    'ANY',
    'ARRAY',
    'AS',
    'ASC',
    'ASYMMETRIC',
    'AUTHORIZATION',
    'BINARY',
    'BOTH',
    'CASE',
    'CAST',
    'CHECK',
    'COLLATE',
    'COLUMN',
    'CONSTRAINT',
    'CREATE',
    'CROSS',
    'CURRENT_DATE',
    'CURRENT_ROLE',
    'CURRENT_TIME',
    'CURRENT_TIMESTAMP',
    'CURRENT_USER',
    'DEFAULT',
    'DEFERRABLE',
    'DISTINCT',
    'DO',
    'ELSE',
    'END',
    'EXCEPT',
    'FALSE',
    'FETCH',
    'FOREIGN',
    'FREEZE',
    'FROM',
    'FULL',
    'GRANT',
    'GROUP',
    'HAVING',
    'ILIKE',
    'IN',
    'INITIALLY',
    'INNER',
    'INTERSECT',
    'INTO',
    'IS',
    'ISNULL',
    'JOIN',
    'LATERAL',
    'LEADING',
    'LEFT',
    'LIKE',
    'LIMIT',
    'LOCALTIME',
    'LOCALTIMESTAMP',
    'NATURAL',
    'NOT',
    'NOTNULL',
    'NULL',
    'OFFSET',
    'ON',
    'ONLY',
    'OR',
    'ORDER',
    'OUTER',
    'OVERLAPS',
    'PLACING',
    'PRIMARY',
    'REFERENCES',
    'RETURNING',
    'RIGHT',
    'SELECT',
    'SESSION_USER',
    'SIMILAR',
    'SOME',
    'SYMMETRIC',
    'TABLE',
    'THEN',
    'TO',
    'TRAILING',
    'TRUE',
    'UNION',
    'UNIQUE',
    'USER',
    'USING',
    'VERBOSE',
    'WHEN',
    'WHERE',
    'WINDOW',
    'WITH'
]
const formRules: FormRules = {
    name: {
        required: true,
        trigger: ['blur', 'input'],
        validator(_, value) {
            // 不得空
            if (!value) {
                return new Error('请输入数据表名称')
            }
            // 字符合法性
            if (!nameRegex.test(value)) {
                return new Error('数据表名称')
            }
            // 长度在 1 到 63 个字符
            if (value.length < 1 || value.length > 63) {
                return new Error('数据表名称长度在 1 到 63 个字符之间')
            }
            // 是否是保留字
            if (reservedWords.includes(value.toUpperCase())) {
                return new Error('不能是保留字！')
            }
            // 是否有同名表
            if (props.tables.some((table) => table.name === value)) {
                return new Error('已存在同名表！')
            }
        }
    },
    schema: {
        required: true,
        trigger: ['blur', 'input'],
        validator(_, value) {
            // 不得空
            if (!value) {
                return new Error('请选择数据表模式')
            } else {
                return true
            }
        }
    },
    column: {
        name: {
            required: true,
            trigger: ['blur', 'input'],
            validator() {
                const name = currentColumn.value.name
                // 不得空
                if (!name) {
                    return new Error(`请输入列名`)
                }
                // 只能是英文
                if (!nameRegex.test(name)) {
                    return new Error(`列名只能包含英文字母`)
                }
                // 长度在 1 到 63 个字符
                if (name.length < 1 || name.length > 63) {
                    return new Error(`列名长度在 1 到 63 个字符之间`)
                }
                // 是否是保留字
                if (reservedWords.includes(name.toUpperCase())) {
                    return new Error(`不能是保留字！`)
                }
                // 是否有重复
                if (model.value.columns.some((column) => column.name === name)) {
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

//#endregion
</script>
