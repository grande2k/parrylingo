<template>
	<LoadingSpinner v-if="singleLessonStore.loading" class="mx-auto mt-24" />

	<div v-if="singleLessonStore.lesson && !singleLessonStore.loading" class="max-w-[600px] mx-auto">
		<div class="flex items-center justify-center gap-1 mb-4 sm:mb-6">
			<p class="text-center underline underline-offset-4">{{ authorFullName }}</p>
			<p class="text-center underline underline-offset-4">{{ singleLessonStore.lesson.language.name }}</p>
		</div>

		<lessons-single-steps />

		<lessons-single-task />
	</div>

	<Teleport to="body">
		<div v-if="showStart" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
			<button
				class="bg-secondary rounded-full border-4 uppercase text-white text-3xl py-4 px-8 cursor-pointer leading-none font-bold tracking-wide"
				@click="startLesson"
			>
				START
			</button>
		</div>
	</Teleport>
</template>

<script setup>
const singleLessonStore = useSingleLessonStore();
const showStart = ref(false);

const authorFullName = computed(() => {
	if (!singleLessonStore.lesson || !singleLessonStore.lesson.user) return "";
	return `${singleLessonStore.lesson.author.first_name} ${singleLessonStore.lesson.author.last_name} /`;
});

const startLesson = () => {
	showStart.value = false;
	singleLessonStore.playAudio();
};

onMounted(async () => {
	singleLessonStore.resetLesson();
	await singleLessonStore.fetchSingleLesson();
	showStart.value = true;
});
</script>
