<template>
	<div>
		<p v-if="label" class="mb-0.5 text-left text-sm">{{ label }}</p>
		<input v-model="model" :type="type" :placeholder="placeholder" class="rounded-lg bg-gray-300 py-2 px-3" />
	</div>
</template>

<script setup>
const props = defineProps({
	label: String,
	type: { type: String, default: "text" },
	placeholder: String,
});

const model = defineModel();
</script>
