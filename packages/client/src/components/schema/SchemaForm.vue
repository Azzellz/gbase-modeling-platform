<template>
    <n-form ref="formRef" class="md:w-1/2" :model="model" :rules="formRules">
        <n-grid :cols="12" :x-gap="24">
            <n-form-item-gi :span="3" label="模式的名称" path="name">
                <n-input v-model:value="model.name" placeholder="请输入模式名称" />
            </n-form-item-gi>
            <n-form-item-gi :span="3" label="模式的所属用户" path="owner">
                <n-input v-model:value="model.owner" placeholder="请输入模式所属用户" />
            </n-form-item-gi>
            <n-gi class="flex items-center gap-4" :span="6">
                <n-button :disabled="!model.name" type="success" @click="handleCreateSchema">
                    创建模式
                </n-button>
            </n-gi>
        </n-grid>
    </n-form>
</template>

<script setup lang="ts">
import type { Schema, SchemaCreateParams } from '@root/models'
import { isPostgreSqlReservedWord, isPostgreSqlValidName } from '@root/shared'
import {
    NForm,
    NGrid,
    NFormItemGi,
    NGi,
    NInput,
    NButton,
    type FormInst,
    type FormRules,
    useMessage
} from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const model = defineModel<SchemaCreateParams>('model', { required: true })
const emits = defineEmits<{
    'create-schema': [params: SchemaCreateParams]
}>()
const props = defineProps<{
    schemas: Schema[]
}>()

const formRef = ref<FormInst | null>(null)
const formRules: FormRules = {
    name: {
        required: true,
        trigger: ['blur', 'input'],
        validator(_, value) {
            if (!value) {
                return new Error('请输入模式名称')
            }
            // 重复性检测
            if (props.schemas.some((schema) => schema.name === value)) {
                return new Error('模式名称已存在')
            }
            // 不能是保留字
            if (isPostgreSqlReservedWord(value)) {
                return new Error('模式名称不能是保留字')
            }
            // 长度在 1 到 63 个字符
            if (value.length < 1 || value.length > 63) {
                return new Error('模式名称长度在 1 到 63 个字符之间')
            }
            // 只能包含字母、数字和下划线
            if (!isPostgreSqlValidName(value)) {
                return new Error('模式名称只能包含字母、数字和下划线')
            }
            return true
        }
    }
}
async function handleCreateSchema() {
    formRef.value?.validate(async (errors) => {
        if (errors) {
            return message.error('请检查表单填写是否正确')
        }
        emits('create-schema', model.value)
    })
}
</script>
