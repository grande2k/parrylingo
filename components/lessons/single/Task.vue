<template>
	<div class="relative border-4 border-gray-400 rounded-2xl p-6">
		<div class="flex items-center gap-4 mb-4">
			<PuzzleMask
				:imageUrl="getStaticUrl(currentWord.image)"
				:empty="singleLessonStore.current_step > 2"
				class="size-24 sm:size-36 mx-auto"
			/>

			<span class="text-black text-4xl sm:text-6xl">+</span>

			<PuzzleMask
				direction="right"
				:imageUrl="getStaticUrl(currentWord.image)"
				:empty="singleLessonStore.current_step > 2"
				class="size-24 sm:size-36 mx-auto"
			/>
		</div>

		<div
			class="absolute left-1/2 -translate-x-1/2 -bottom-6 bg-secondary rounded-full text-lg tracking-wide text-white text-center w-[240px] sm:w-[300px] p-2 font-bold mx-auto"
		>
			{{ currentWord.title }}
		</div>

		<button
			class="absolute -right-4 sm:-right-5 -bottom-6 sm:-bottom-5 flex items-center justify-center bg-gray-600 rounded-full text-lg text-white size-12 cursor-pointer transition hover:bg-gray-800"
			@click="singleLessonStore.playAudio()"
		>
			<IconSound />
		</button>
	</div>

	<div class="grid grid-cols-2 gap-4 mt-10">
		<button
			v-for="word in singleLessonStore.shuffledWords"
			:key="word.id"
			@click="selectAnswer(word)"
			:class="['btn-answer', selectedWordId === word.id ? 'zoom' : '', getBorderClass(word.id)]"
		>
			<img :src="getStaticUrl(word.image)" class="size-32 sm:size-42 object-contain" alt="" />
		</button>
	</div>

	<LessonsSingleResult :open="showResultModal" @close="showResultModal = false" />
</template>

<script setup>
const singleLessonStore = useSingleLessonStore();

const selectedWordId = ref(null);
const answerStatus = ref(null);
const showResultModal = ref(false);

const currentWord = computed(() => {
	if (singleLessonStore.current_step % 2) {
		return singleLessonStore.lesson.words[0];
	} else {
		return singleLessonStore.lesson.words[1];
	}
});

const selectAnswer = answer => {
	selectedWordId.value = answer.id;

	setTimeout(() => {
		const isCorrect = answer.title === currentWord.value.title;
		answerStatus.value = isCorrect ? "correct" : "wrong";

		setTimeout(() => {
			singleLessonStore.stepsStatus[singleLessonStore.current_step - 1] = answerStatus.value;
			selectedWordId.value = null;
			answerStatus.value = null;

			setTimeout(() => {
				if (singleLessonStore.current_step === 4) {
					showResultModal.value = true;
				} else {
					singleLessonStore.current_step += 1;
					singleLessonStore.shuffleWords();
				}
			}, 200);
		}, 400);
	}, 200);
};

const getBorderClass = wordId => {
	if (selectedWordId.value !== wordId) return "btn-border-default";

	if (answerStatus.value === "correct") return "btn-border-correct";
	if (answerStatus.value === "wrong") return "btn-border-wrong";

	return "btn-border-default";
};
</script>
