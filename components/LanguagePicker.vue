<template>
	<div v-if="showLanguages" class="flex justify-center items-center gap-4">
		<p>Language to learn:</p>

		<div class="relative w-48">
			<select
				v-model="currentLangName"
				class="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
			>
				<option disabled value="">Select language</option>
				<option v-for="item in languages" :key="item.id" :value="item.name">
					{{ item.name }}
				</option>
			</select>

			<div
				class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 transition-transform duration-200"
			>
				<IconArrowDown />
			</div>
		</div>
	</div>
</template>

<script setup>
await useFetch("/api/languages", { key: "languages" });

const { data: languages } = useNuxtData("languages");

const showLanguages = computed(() => languages.value && languages.value.length);
const currentLangName = computed(() => languages.value.find(lang => lang.id === currentLanguage.value)?.name);

const currentLanguage = ref(null);

onMounted(() => {
	currentLanguage.value = localStorage.getItem("language_id") ?? languages.value?.[0]?.id;
});

watch(currentLanguage, (newLang, oldLang) => {
	if (newLang && newLang !== oldLang) {
		localStorage.setItem("language_id", newLang);
	}
});
</script>

<style scoped>
select:invalid {
	color: gray;
}
</style>
