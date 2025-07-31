<template>
	<div class="flex gap-2 items-center">
		<p class="text-gray-500">{{ $t("categories") }}</p>
		<SharedSelect v-model="lessonsStore.filters.topic_id" :options="options" :defaultAll="true" />
	</div>
</template>

<script setup>
const languageStore = useLanguageStore();
const lessonsStore = useLessonsStore();

const categories = ref([]);

const fetchCategories = async () => {
	const { data, error } = await useAPI("/admin/topic");

	if (error.value) return;

	categories.value = data.value;
};

const options = computed(() => {
	if (!categories.value || !languageStore.language) return [];

	return categories.value.map(cat => {
		const label = getTitleForLang(cat.names, languageStore.language.language_code, true);
		return { value: cat.id, label };
	});
});

onMounted(fetchCategories);
</script>
