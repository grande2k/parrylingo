<template>
	<LoadingSpinner v-if="singleLessonStore.loading" class="mx-auto mt-24" />

	<div v-if="singleLessonStore.lesson && !singleLessonStore.loading" class="max-w-[600px] mx-auto">
		<div class="flex items-center justify-center gap-1 mb-4 sm:mb-6">
			<button @click="goBack" class="rounded cursor-pointer pr-1">
				<IconBack class="size-4" />
			</button>

			<nuxt-link
				v-if="langStore.language"
				:to="`/?language_id=${langStore.language.id}`"
				class="text-center underline underline-offset-4"
			>
				{{ langStore.language.name }}
			</nuxt-link>

			<p v-if="singleLessonStore.lesson.user">/</p>

			<p
				v-if="singleLessonStore.lesson.user"
				@click="openUserLessons"
				class="text-center underline underline-offset-4 cursor-pointer"
			>
				{{ singleLessonStore.lesson.user.name }}
			</p>
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
const langStore = useLanguageStore();
const singleLessonStore = useSingleLessonStore();
const showStart = ref(false);

const startLesson = () => {
	showStart.value = false;
	singleLessonStore.playAudio();
};

const goBack = () => {
	navigateTo("/");
};

const openUserLessons = async () => {
	console.log(langStore.language, singleLessonStore.lesson);
	const user_id = singleLessonStore.lesson.user.id;
	const lang_id = langStore.language?.id;
	if (!user_id || !lang_id) return;
	await navigateTo(`/?user_id=${user_id}&language_id=${lang_id}`);
};

onMounted(async () => {
	singleLessonStore.resetLesson();
	await singleLessonStore.fetchSingleLesson();
	showStart.value = true;
});
</script>
