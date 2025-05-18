<template>
	<div v-if="singleLessonStore.lesson" class="max-w-[600px] mx-auto">
		<div class="flex items-center justify-center gap-1 mb-6">
			<p class="text-center underline underline-offset-4">{{ authorFullName }}</p>
			/
			<p class="text-center underline underline-offset-4">{{ singleLessonStore.lesson.language.name }}</p>
		</div>

		<lessons-single-steps />

		<lessons-single-task />
	</div>
</template>

<script setup>
import { useSingleLessonStore } from "~/stores/single-lesson";

const singleLessonStore = useSingleLessonStore();

const authorFullName = computed(() => {
	if (!singleLessonStore.lesson) return "";
	return `${singleLessonStore.lesson.author.first_name} ${singleLessonStore.lesson.author.last_name}`;
});

onMounted(async () => {
	await nextTick();
	const { data } = await useFetch("/api/lesson");
	console.log(data.value);
	singleLessonStore.lesson = data.value;
});
</script>
