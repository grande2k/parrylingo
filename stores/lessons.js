import { defineStore } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";

export const useLessonsStore = defineStore("lessons", () => {
	const lessons = ref(null);
	const loading = ref(true);
	const route = useRoute();

	const fetchLessons = async () => {
		loading.value = true;

		const lang_id = route.name === "index" ? localStorage.getItem("language_id") : null;
		const { data, error } = await useAPI(lang_id ? `/lessons?language_id=${lang_id}` : "/lessons");

		loading.value = false;

		if (error.value) {
			console.error("Error fetching lessons");
		} else {
			lessons.value = data.value?.items || null;
		}
	};

	return { lessons, loading, fetchLessons };
});
