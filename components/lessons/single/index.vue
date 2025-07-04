<template>
	<LoadingSpinner v-if="singleLessonStore.loading" class="mx-auto mt-24" />

	<div v-if="singleLessonStore.lesson && !singleLessonStore.loading" class="max-w-[600px] mx-auto">
		<div class="flex items-center justify-center gap-1 mb-4 sm:mb-6">
			<button @click="goBack" class="rounded cursor-pointer pr-1">
				<IconBack class="size-4" />
			</button>

			<nuxt-link
				:to="`/?language_id=${singleLessonStore.lesson.language.id}`"
				class="text-center underline underline-offset-4"
			>
				{{ singleLessonStore.lesson.language.name }}
			</nuxt-link>

			<p v-if="singleLessonStore.lesson.user">/</p>

			<nuxt-link
				v-if="singleLessonStore.lesson.user"
				:to="`/?user_id=${singleLessonStore.lesson.user.id}&language_id=${singleLessonStore.lesson.language.id}`"
				class="text-center underline underline-offset-4"
			>
				{{ singleLessonStore.lesson.user.name }}
			</nuxt-link>
		</div>

		<lessons-single-steps />

		<lessons-single-task :show-start="showStart" />
	</div>

	<Teleport to="body">
		<div v-if="showStart" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
			<button
				class="bg-secondary rounded-full border-4 uppercase text-white text-3xl py-4 px-8 cursor-pointer leading-none font-bold tracking-wide"
				@click="startLesson"
			>
				{{ $t("start") }}
			</button>
		</div>
	</Teleport>
</template>

<script setup>
const singleLessonStore = useSingleLessonStore();
const showStart = ref(false);

const startLesson = () => {
	showStart.value = false;
	singleLessonStore.playAudio();
};

const goBack = () => {
	navigateTo("/");
};

onMounted(async () => {
	singleLessonStore.resetLesson();
	await singleLessonStore.fetchSingleLesson();
	showStart.value = true;
});
</script>
