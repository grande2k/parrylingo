<template>
	<div class="flex justify-center gap-4 mb-6">
		<div
			v-for="step in 4"
			:key="step"
			class="size-12 bg-dark-gray text-white rounded-full cursor-pointer flex items-center justify-center"
			:class="{
				'bg-secondary': singleLessonStore.stepsStatus[step - 1] === 'correct',
				'bg-red-500': singleLessonStore.stepsStatus[step - 1] === 'wrong',
				'bg-gray-900': singleLessonStore.current_step === step,
			}"
		>
			{{ step }}
		</div>
	</div>
</template>

<script setup>
import { useSingleLessonStore } from "~/stores/single-lesson";

const singleLessonStore = useSingleLessonStore();
</script>
