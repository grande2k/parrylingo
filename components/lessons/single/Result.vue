<template>
	<div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
		<div class="bg-white p-8 rounded-full size-[360px] text-center relative shadow-lg">
			<img :src="resultImagePath" alt="Результат" class="mx-auto w-[320px] scale-110 h-auto" />

			<button
				class="bg-secondary absolute -bottom-7 left-1/2 -translate-x-1/2 text-white size-20 text-2xl rounded-full font-semibold cursor-pointer leading-none"
				@click="close"
			>
				OK
			</button>
		</div>
	</div>
</template>

<script setup>
const router = useRouter();
const emit = defineEmits(["close"]);
const singleLessonStore = useSingleLessonStore();

const correctAnswers = computed(() => singleLessonStore.stepsStatus.filter(status => status === "correct").length);

const resultImagePath = computed(() => {
	return `/images/results/result${correctAnswers.value}.png`;
});

const close = () => {
	emit("close");
	singleLessonStore.resetLesson();
	router.push("/");
};
</script>
