<script setup lang="ts">
import { API } from '@/api'
import MermaidGraph from '@/components/MermaidGraph.vue'
import { isSuccessResponse } from '@root/shared'
import { ref } from 'vue'

const template = ref(`
erDiagram
	employees {
		int id 
		string name 
		string position 
		float salary 
		datetime hire_date 
		string undefined 
		string WITH 
		string CREATE 
		string START 
		string INCREMENT 
		string NO 
		string NO 
		string CACHE 
		datetime COPY 
		string SELECT 
		int ADD 
	}

`)
API.mermaid.getMermaidErdCode().then((res) => {
    if (isSuccessResponse(res)) {
        template.value = res.data
        console.log(res.data)
    }
})
</script>

<template>
    <main class="h-full">
        <MermaidGraph v-if="template" :template="template" />
    </main>
</template>
