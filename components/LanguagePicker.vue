<template>
	<div v-if="showLanguages" class="flex justify-center items-center gap-4">
		<p class="text-sm sm:text-base">{{ $t("language_to_learn") }}:</p>

		<div class="relative w-48">
			<button
				type="button"
				@click="isOpen = !isOpen"
				class="trigger w-full flex justify-between items-center bg-secondary rounded-md px-3 py-1 text-sm shadow-sm outline-none"
			>
				<div class="flex items-center gap-2">
					<span
						v-if="selected"
						:class="`fi fi-${selected.language_code === 'en' ? 'gb' : selected.language_code}`"
						class="!block !size-6 rounded-sm !bg-transparent"
					/>
					<span class="text-white text-lg">{{ selected?.name || $t("select_language") }}</span>
				</div>
				<IconArrowDown class="text-white size-5" />
			</button>

			<div
				v-show="isOpen"
				ref="dropdown"
				class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto"
			>
				<div
					v-for="lang in languages"
					:key="lang.id"
					@click="select(lang.id)"
					class="dropdown-item px-4 py-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-100"
				>
					<span
						:class="`fi fi-${lang.language_code === 'en' ? 'gb' : lang.language_code}`"
						class="w-5 h-5 rounded-sm"
					/>
					<span>{{ lang.name }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();

const lessonsStore = useLessonsStore();
const languageStore = useLanguageStore();

const languages = ref([]);
const currentLanguage = ref("");

const isOpen = ref(false);
const dropdown = ref(null);

const showLanguages = computed(() => languages.value.length > 0);

const selected = computed(() => {
	if (!languages.value.length) return null;
	return languages.value.find(opt => opt.id === currentLanguage.value);
});

const select = id => {
	currentLanguage.value = id;
	isOpen.value = false;
};

const handleClickOutside = event => {
	if (!dropdown.value) return;
	if (event.target.closest(".trigger") || event.target.classList.contains("trigger")) return;
	if (event.target.closest(".dropdown-item") || event.target.classList.contains("dropdown-item")) return;
	if (!(dropdown.value === event.target || dropdown.value.contains(event.target))) {
		isOpen.value = false;
	}
};

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
			languageStore.language = found;
		} else if (saved) {
			found = data.value.find(lang => lang.id === saved);
			currentLanguage.value = found?.id;
			languageStore.language = found;
		} else {
			currentLanguage.value = data.value[0]?.id;
			languageStore.language = data.value[0];
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
			languageStore.language = languages.value.find(lang => lang.id === newLang);
			lessonsStore.fetchLessons();
		} else if (user_id_query) {
			router.replace({ query: { user_id: user_id_query, language_id: newLang } });
			lessonsStore.fetchUserLessons(user_id_query, newLang);
		} else {
			router.replace({ query: null });
			localStorage.setItem("language_id", newLang);
			languageStore.language = languages.value.find(lang => lang.id === newLang);
			lessonsStore.fetchLessons();
		}
	}
});

watch(
	() => route.query,
	() => lessonsStore.fetchLessons(),
	{ deep: true }
);

onMounted(async () => {
	if (route.query.user_id) {
		fetcUserLanguages();
		lessonsStore.fetchUserLessons(route.query.user_id, route.query.language_id);
	} else {
		fetchLanguages();
	}

	await nextTick(() => {
		document.addEventListener("click", handleClickOutside);
	});
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
select:invalid {
	color: gray;
}
</style>
