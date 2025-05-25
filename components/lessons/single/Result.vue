<template>
	<div
		class="fixed inset-0 bg-black/60 -z-1 flex items-center justify-center transition duration"
		:class="{ 'opacity-0': !open, 'opacity-100 z-50': open }"
	>
		<div
			class="bg-white p-8 rounded-full size-[300px] sm:size-[360px] text-center relative shadow-lg scale-90 opacity-0 transition duration"
			:class="{ 'scale-100 opacity-100': open }"
		>
			<img
				:src="resultImagePath"
				alt="Результат"
				class="mx-auto w-[320px] h-auto transition-transform duration-700"
				:class="{ 'rotate-0': open, 'rotate-[360deg]': !open }"
			/>

			<button
				class="bg-secondary absolute -bottom-7 left-1/2 -translate-x-1/2 text-white size-16 sm:size-20 text-xl sm:text-2xl rounded-full font-semibold cursor-pointer leading-none transition duration-500 delay-1000 opacity-0"
				:class="{ 'opacity-100': open }"
				@click="close"
			>
				OK
			</button>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	open: Boolean,
});

const emit = defineEmits(["close"]);
const router = useRouter();
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

<style scoped>
.rotate-0 {
	transform: rotate(0deg);
}

.rotate-\[360deg\] {
	transform: rotate(360deg);
}
</style>
