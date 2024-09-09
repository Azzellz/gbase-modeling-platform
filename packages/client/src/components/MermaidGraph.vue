<template>
    <div v-html="mermaidSvg" />
</template>

<script setup lang="ts">
import mermaid from 'mermaid'
import { onMounted, ref } from 'vue'
const props = defineProps<{
    template: string
}>()
console.log(props.template)
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })
const mermaidSvg = ref('')
onMounted(async () => {
    const { svg } = await mermaid.render('mermaid-test', props.template)
    mermaidSvg.value = svg
})
</script>
