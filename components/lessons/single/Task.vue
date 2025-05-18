<template>
	<div class="border-4 border-gray-400 rounded-2xl p-4">
		<div class="flex items-center gap-4 mb-6">
			<PuzzleMask :imageUrl="singleLessonStore.lesson.words[0].image" class="size-24 mx-auto" />

			<span class="text-black text-3xl">+</span>

			<PuzzleMask direction="right" :imageUrl="singleLessonStore.lesson.words[0].image" class="size-24 mx-auto" />
		</div>

		<div
			class="bg-secondary rounded-full text-lg tracking-wide text-white text-center w-[300px] p-2 font-bold mx-auto"
		>
			{{ singleLessonStore.lesson.words[0].title }}
		</div>
	</div>
</template>

<script setup>
import { useSingleLessonStore } from "~/stores/single-lesson";

const singleLessonStore = useSingleLessonStore();
</script>
