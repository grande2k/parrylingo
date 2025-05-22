<template>
	<div class="relative border-4 border-gray-400 rounded-2xl p-6">
		<div class="flex items-center gap-4 mb-4">
			<PuzzleMask
				:imageUrl="getStaticUrl(currentWord.image)"
				:empty="singleLessonStore.current_step > 2"
				class="size-36 mx-auto"
			/>

			<span class="text-black text-6xl">+</span>

			<PuzzleMask
				direction="right"
				:imageUrl="getStaticUrl(currentWord.image)"
				:empty="singleLessonStore.current_step > 2"
				class="size-36 mx-auto"
			/>
		</div>

		<div
			class="absolute left-1/2 -translate-x-1/2 -bottom-6 bg-secondary rounded-full text-lg tracking-wide text-white text-center w-[300px] p-2 font-bold mx-auto"
		>
			{{ currentWord.title }}
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4 mt-10">
		<button
			v-for="word in singleLessonStore.shuffledWords"
			:key="word.id"
			class="border-4 border-gray-400 rounded-2xl flex items-center justify-center overflow-hidden aspect-square cursor-pointer"
			@click="selectAnswer(word)"
		>
			<img :src="getStaticUrl(word.image)" class="size-42 object-contain" alt="" />
		</button>
	</div>

	<LessonsSingleResult v-if="showResultModal" @close="showResultModal = false" />
</template>

<script setup>
import { useSingleLessonStore } from "~/stores/single-lesson";

const singleLessonStore = useSingleLessonStore();

const showResultModal = ref(false);

const currentWord = computed(() => {
	if (singleLessonStore.current_step % 2) {
		return singleLessonStore.lesson.words[0];
	} else {
		return singleLessonStore.lesson.words[1];
	}
});

const selectAnswer = answer => {
	const isCorrect = answer.title === currentWord.value.title;
	singleLessonStore.stepsStatus[singleLessonStore.current_step - 1] = isCorrect ? "correct" : "wrong";

	if (singleLessonStore.current_step === 4) {
		showResultModal.value = true;
	} else {
		singleLessonStore.current_step += 1;
		singleLessonStore.shuffleWords();
	}
};
</script>
