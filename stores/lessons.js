import { defineStore } from "pinia";
import { ref } from "vue";

export const useLessonsStore = defineStore("lessons", () => {
	const lessons = ref(null);
	const user = ref(null);
	const loading = ref(true);

	const fetchLessons = async lang_id_query => {
		loading.value = true;

		const lang_id = lang_id_query || localStorage.getItem("language_id");
		const { data, error } = await useAPI(`/lessons?language_id=${lang_id}&size=${100}`);

		loading.value = false;

		if (error.value) {
			console.error("Error fetching lessons");
		} else {
			lessons.value = data.value?.items || null;
		}
	};

	const fetchUserLessons = async (user_id, lang_id) => {
		loading.value = true;

		if (!lang_id || !user_id) {
			await navigateTo("/");
			loading.value = false;
			return;
		}

		const { data, error } = await useAPI(`/lessons/user/${user_id}/language/${lang_id}?size=${100}`);

		loading.value = false;

		if (error.value) {
			console.error("Error fetching user lessons");
		} else {
			user.value = data.value?.user;
			lessons.value = data.value?.lessons || [];
		}
	};

	return { lessons, user, loading, fetchLessons, fetchUserLessons };
});
