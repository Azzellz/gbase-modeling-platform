<template>
    <div v-html="mermaidSvg" />
</template>

<script setup lang="ts">
import mermaid from 'mermaid'
import { ref, watchEffect } from 'vue'
const props = defineProps<{
    template: string
}>()
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })
const mermaidSvg = ref('')
watchEffect(async () => {
    if (props.template) {
        const { svg } = await mermaid.render('mermaid-test', props.template)
        mermaidSvg.value = svg
    }
})
</script>
