<template>
	<div v-if="singleLessonStore.lesson" class="max-w-[600px] mx-auto">
		<div class="flex items-center justify-center gap-1 mb-6">
			<p class="text-center underline underline-offset-4">{{ authorFullName }}</p>
			<p class="text-center underline underline-offset-4">{{ singleLessonStore.lesson.language.name }}</p>
		</div>

		<lessons-single-steps />

		<lessons-single-task />
	</div>
</template>

<script setup>
const singleLessonStore = useSingleLessonStore();

const route = useRoute();

const authorFullName = computed(() => {
	if (!singleLessonStore.lesson || !singleLessonStore.lesson.user) return "";
	return `${singleLessonStore.lesson.author.first_name} ${singleLessonStore.lesson.author.last_name} /`;
});

onMounted(async () => {
	await nextTick();
	const lesson_id = route.params.lesson_id;
	const { data } = await useAPI(`/lesson/${lesson_id}`);
	singleLessonStore.lesson = data.value;

	if (data.value?.words?.length) {
		singleLessonStore.shuffleWords();
	}
});
</script>
