import { defineStore } from "pinia";
import { ref } from "vue";

export const useLessonsStore = defineStore("lessons", () => {
	const lessons = ref(null);
	const loading = ref(true);

	const fetchLessons = async () => {
		loading.value = true;

		const lang_id = localStorage.getItem("language_id");
		const { data, error } = await useAPI(`/lessons?language_id=${lang_id}`);

		loading.value = false;

		if (error.value) {
			console.error("Error fetching lessons");
		} else {
			lessons.value = data.value?.items || null;
		}
	};

	return { lessons, loading, fetchLessons };
});
