<template>
	<LoadingSpinner v-if="singleLessonStore.loading" class="mx-auto mt-24" />

	<div v-if="singleLessonStore.lesson && !singleLessonStore.loading" class="max-w-[600px] mx-auto">
		<Teleport to="#container">
			<button
				class="absolute right-4 top-4 flex items-center justify-center rounded-full text-white size-10 sm:size-12 select-none cursor-pointer"
				:class="[isSoundDisabled ? 'bg-red-500' : 'bg-secondary', isShaking ? 'shake' : '']"
				@click="toggleSound"
			>
				<IconSound v-if="!isSoundDisabled" class="size-5 sm:size-6" />
				<IconSoundOff v-else class="size-5 sm:size-6" />
			</button>
		</Teleport>

		<div class="flex items-center justify-center gap-1 mb-4 sm:mb-6">
			<nuxt-link
				v-if="authorName"
				:to="`/?user_id=${singleLessonStore.lesson.user.id}&language_id=${singleLessonStore.lesson.language.id}`"
				class="text-center underline underline-offset-4"
			>
				{{ authorName }}
			</nuxt-link>
			<nuxt-link
				:to="`/?language_id=${singleLessonStore.lesson.language.id}`"
				class="text-center underline underline-offset-4"
			>
				{{ singleLessonStore.lesson.language.name }}
			</nuxt-link>
		</div>

		<lessons-single-steps />

		<lessons-single-task :isSoundDisabled="isSoundDisabled" @play-muted="startShaking" />
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

const authorName = computed(() => {
	if (!singleLessonStore.lesson || !singleLessonStore.lesson.user) return "";
	return `${singleLessonStore.lesson.user.name} /`;
});

const startLesson = () => {
	showStart.value = false;
	singleLessonStore.playAudio();
};

const isSoundDisabled = ref(false);

const toggleSound = () => {
	isSoundDisabled.value = !isSoundDisabled.value;
	localStorage.setItem("lesson_sound_disabled", isSoundDisabled.value.toString());
};

onMounted(async () => {
	isSoundDisabled.value = localStorage.getItem("lesson_sound_disabled") === "true";
	singleLessonStore.resetLesson();
	await singleLessonStore.fetchSingleLesson();
	showStart.value = true;
});

const isShaking = ref(false);
let animationInterval;

const startShaking = () => {
	isShaking.value = false;

	requestAnimationFrame(() => {
		isShaking.value = true;

		setTimeout(() => {
			isShaking.value = false;
		}, 500);
	});
};

watch(isSoundDisabled, value => {
	if (value) {
		startShaking();
		animationInterval = setInterval(startShaking, 5000);
	} else {
		if (animationInterval) clearInterval(animationInterval);
	}
});

onUnmounted(() => clearInterval(animationInterval));
</script>
