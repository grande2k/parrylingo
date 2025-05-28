<template>
	<div
		class="mb-4 sm:mb-6"
		:class="rouletteStore.stepsStatus.length > 4 ? 'grid grid-cols-9 gap-2' : 'flex justify-center gap-4'"
	>
		<div
			v-for="(status, index) in rouletteStore.stepsStatus"
			:key="index"
			class="bg-dark-gray text-white leading-none rounded-full flex items-center justify-center"
			:class="{
				'bg-secondary': status === 'correct',
				'bg-red-500': status === 'wrong',
				'bg-gray-900': rouletteStore.current_step === index + 1,
				'size-8 sm:size-10 text-sm': rouletteStore.stepsStatus.length === 18,
				'size-10 sm:size-12 text-base': rouletteStore.stepsStatus.length === 4,
			}"
		>
			{{ index + 1 }}
		</div>
	</div>
</template>

<script setup>
const rouletteStore = useRouletteStore();
</script>
