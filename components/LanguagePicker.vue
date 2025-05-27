<template>
	<div v-if="showLanguages" class="flex justify-center items-center gap-4">
		<p class="text-sm sm:text-base">Language to learn:</p>

		<div class="relative w-48">
			<select
				v-model="currentLanguage"
				class="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
			>
				<option v-if="!currentLanguage" disabled value="">Select language</option>
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
const lessonsStore = useLessonsStore();

const languages = ref([]);
const currentLanguage = ref("");

const showLanguages = computed(() => languages.value.length > 0);

const fetchLanguages = async () => {
	const { data, error } = await useAPI("/languages");

	if (error.value) {
		console.error("Error fetching languages");
	} else {
		languages.value = data.value;

		const saved = localStorage.getItem("language_id");
		const found = data.value.find(lang => lang.id === saved);

		currentLanguage.value = found?.id || data.value[0]?.id;

		localStorage.setItem("language_id", currentLanguage.value);
		await lessonsStore.fetchLessons();
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
		localStorage.setItem("language_id", newLang);
		await lessonsStore.fetchLessons();
	}
});

onMounted(fetchLanguages);
</script>

<style scoped>
select:invalid {
	color: gray;
}
</style>
