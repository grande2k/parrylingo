<template>
	<div class="flex items-center justify-center gap-2 mb-4">
		<p>{{ $t("sort_by") }}</p>
		<div class="relative">
			<select
				v-model="filters.sort_by"
				name="sort_by"
				class="block w-24 appearance-none rounded-md border border-gray-300 bg-white py-1.5 px-3 pr-10 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
			>
				<option value="date">{{ $t("sort_by_date") }}</option>
				<option value="name">{{ $t("sort_by_name") }}</option>
			</select>

			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
				<IconArrowDown />
			</div>
		</div>
	</div>

	<div v-if="lessons?.items.length" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
		<LessonsCard
			v-for="lesson in lessons.items"
			:key="lesson.id"
			:lesson="lesson"
			@click="$router.push(`/${lesson.id}`)"
		/>
	</div>

	<p v-else class="mt-12 text-center">{{ $t("no_lessons") }}</p>
</template>

<script setup>
const lessons = ref(null);
const filters = ref({ sort_by: "date" });

const fetchLessonsByAuthors = async () => {
	const { data, error } = await useAPI("/authors", {
		query: { page: 1, limit: 100, sort_by: filters.value.sort_by },
	});

	if (error.value) {
		console.error("Error fetching authors");
	} else {
		lessons.value = data.value;
	}
};

watch(filters, fetchLessonsByAuthors, { deep: true });

onMounted(fetchLessonsByAuthors);
</script>
