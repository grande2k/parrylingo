import { defineStore } from "pinia";
import { ref } from "vue";

export const useSingleLessonStore = defineStore("single-lesson", () => {
	const lesson = ref(null);
	const current_step = ref(1);

	return { lesson, current_step };
});
