import { defineStore } from "pinia";
import { ref } from "vue";

export const useSingleLessonStore = defineStore("single-lesson", () => {
	const lesson = ref(null);
	const current_step = ref(1);
	const stepsStatus = ref([null, null, null, null]);
	const shuffledWords = ref([]);

	const shuffleWords = () => {
		if (!lesson.value?.words?.length) return;
		shuffledWords.value = [...lesson.value.words].sort(() => Math.random() - 0.5);
	};

	return { lesson, current_step, stepsStatus, shuffledWords, shuffleWords };
});
