import { defineStore } from "pinia";
import { ref } from "vue";

export const useLessonsStore = defineStore("lessons", () => {
	const lessons = ref(null);
	const filters = ref({ search: null, topic_id: null });
	const user = ref(null);
	const loading = ref(true);

	const fetchLessons = async lang_id_query => {
		if (!lessons.value) loading.value = true;

		const lang_id = lang_id_query || localStorage.getItem("language_id");
		const { data, error } = await useAPI(`/lessons?language_id=${lang_id}`, {
			query: {
				size: 100,
				search: filters.value.search,
				topic_id: filters.value.topic_id,
			},
		});

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

		const { data, error } = await useAPI(`/lessons/user/${user_id}/language/${lang_id}`, {
			query: {
				size: 100,
				search: filters.value.search,
				topic_id: filters.value.topic_id,
			},
		});

		loading.value = false;

		if (error.value) {
			console.error("Error fetching user lessons");
		} else {
			user.value = data.value?.user;
			lessons.value = data.value?.lessons || [];
		}
	};

	watch(
		() => filters.value.search,
		() => fetchLessons()
	);

	watch(
		() => filters.value.topic_id,
		() => fetchLessons()
	);

	return { lessons, user, loading, filters, fetchLessons, fetchUserLessons };
});
