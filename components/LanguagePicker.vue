<template>
	<div v-if="showLanguages" class="flex justify-center items-center gap-4">
		<p class="text-sm sm:text-base">{{ $t("language_to_learn") }}:</p>

		<div class="relative w-48">
			<select
				v-model="currentLanguage"
				class="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
			>
				<option v-if="!currentLanguage" disabled value="">{{ $t("select_language") }}</option>
				<option v-for="item in languages" :key="item.id" :value="item.id">
					{{ item.name }}
				</option>
			</select>

			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
				<IconArrowDown />
			</div>
		</div>
	</div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();

const lessonsStore = useLessonsStore();

const languages = ref([]);
const currentLanguage = ref("");

const showLanguages = computed(() => languages.value.length > 0);

const fetchLanguages = async () => {
	const { data, error } = await useAPI("/languages?with_lessons=true");

	if (error.value) {
		console.error("Error fetching languages");
	} else {
		languages.value = data.value;

		const query = route.query.language_id;
		const saved = localStorage.getItem("language_id");

		let found;

		if (query) {
			found = data.value.find(lang => lang.id === query);
			currentLanguage.value = found?.id;
		} else if (saved) {
			found = data.value.find(lang => lang.id === saved);
			currentLanguage.value = found?.id;
		} else {
			currentLanguage.value = data.value[0]?.id;
		}

		if (!query) localStorage.setItem("language_id", currentLanguage.value);

		await lessonsStore.fetchLessons(query);
	}
};

const fetcUserLanguages = async () => {
	const user_id = route.query.user_id;

	if (!user_id) return;

	const { data, error } = await useAPI(`/user/${user_id}/languages`);

	if (error.value) {
		console.error("Error fetching user languages");
	} else {
		languages.value = data.value;

		const lang_id_query = route.query.language_id;
		const found = data.value.find(lang => lang.id === lang_id_query);
		currentLanguage.value = found?.id;
	}
};

let initialized = false;

watch(currentLanguage, async (newLang, oldLang) => {
	if (!newLang) return;

	if (!initialized) {
		initialized = true;
		return;
	}

	if (newLang !== oldLang) {
		const user_id_query = route.query.user_id;
		const lang_id_query = route.query.language_id;

		if (!lang_id_query) {
			localStorage.setItem("language_id", newLang);
			lessonsStore.fetchLessons();
		} else if (user_id_query) {
			router.replace({ query: { user_id: user_id_query, language_id: newLang } });
			lessonsStore.fetchUserLessons(user_id_query, newLang);
		} else {
			router.replace({ query: null });
			localStorage.setItem("language_id", newLang);
			lessonsStore.fetchLessons();
		}
	}
});

watch(
	() => route.query,
	() => lessonsStore.fetchLessons(),
	{ deep: true }
);

onMounted(() => {
	if (route.query.user_id) {
		fetcUserLanguages();
		lessonsStore.fetchUserLessons(route.query.user_id, route.query.language_id);
	} else {
		fetchLanguages();
	}
});
</script>

<style scoped>
select:invalid {
	color: gray;
}
</style>
