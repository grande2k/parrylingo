<template>
	<div class="flex justify-center gap-4 mb-4 sm:mb-6">
		<div
			v-for="(status, index) in rouletteStore.stepsStatus"
			:key="index"
			class="size-10 sm:size-12 bg-dark-gray text-white leading-none rounded-full flex items-center justify-center"
			:class="{
				'bg-secondary': status === 'correct',
				'bg-red-500': status === 'wrong',
				'bg-gray-900': rouletteStore.current_step === index + 1,
			}"
		>
			{{ index + 1 }}
		</div>
	</div>
</template>

<script setup>
const rouletteStore = useRouletteStore();
</script>
