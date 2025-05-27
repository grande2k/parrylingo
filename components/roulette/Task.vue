<template>
	<div class="relative border-4 border-gray-400 rounded-2xl p-6">
		<div class="flex items-center gap-4 mb-4">
			<PuzzleMask empty class="size-24 sm:size-36 mx-auto" />

			<span class="text-black text-4xl sm:text-6xl">+</span>

			<PuzzleMask direction="right" empty class="size-24 sm:size-36 mx-auto" />
		</div>

		<div
			class="absolute left-1/2 -translate-x-1/2 -bottom-6 bg-secondary rounded-full text-lg tracking-wide text-white text-center w-[300px] p-2 font-bold mx-auto"
		>
			{{ currentWord.title }}
		</div>

		<button
			class="absolute -right-5 -bottom-5 flex items-center justify-center bg-gray-600 rounded-full text-lg text-white size-12 cursor-pointer transition hover:bg-gray-800"
			@click="rouletteStore.playAudio()"
		>
			<IconSound />
		</button>
	</div>

	<div class="grid grid-cols-2 gap-4 mt-10">
		<button
			v-for="word in rouletteStore.shuffledWords"
			:key="word.id"
			@click="selectAnswer(word)"
			:class="['btn-answer', selectedWordId === word.id ? 'zoom' : '', getBorderClass(word.id)]"
		>
			<img :src="getStaticUrl(word.image)" class="size-42 object-contain" alt="" />
		</button>
	</div>

	<Result
		:open="showResultModal"
		:stepsStatus="rouletteStore.stepsStatus"
		isRoulette
		@close="showResultModal = false"
	/>
</template>

<script setup>
const rouletteStore = useRouletteStore();
const selectedWordId = ref(null);
const answerStatus = ref(null);
const showResultModal = ref(false);

const total = computed(() => rouletteStore.stepsStatus.length);

const currentWord = computed(() => {
	return rouletteStore.words[(rouletteStore.current_step - 1) % rouletteStore.words.length];
});

const selectAnswer = answer => {
	selectedWordId.value = answer.id;

	setTimeout(() => {
		const isCorrect = answer.title === currentWord.value.title;
		answerStatus.value = isCorrect ? "correct" : "wrong";

		setTimeout(() => {
			rouletteStore.stepsStatus[rouletteStore.current_step - 1] = answerStatus.value;
			selectedWordId.value = null;
			answerStatus.value = null;

			setTimeout(() => {
				if (rouletteStore.current_step >= total.value) {
					showResultModal.value = true;
				} else {
					rouletteStore.current_step += 1;
					rouletteStore.shuffle();
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
