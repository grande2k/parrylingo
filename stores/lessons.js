import { defineStore } from "pinia";
import { ref } from "vue";

export const useLessonsStore = defineStore("lessons", () => {
	const lessons = ref(null);

	const fetchLessons = async () => {
		const { data, error } = await useAPI("/lessons");

		if (error.value) {
			console.error("Error fetching lessons");
		} else {
			lessons.value = data.value?.items || null;
		}
	};

	return { lessons, fetchLessons };
});
