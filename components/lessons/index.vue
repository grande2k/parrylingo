<template>
	<section class="lessons">
		<language-picker />

		<div v-if="lessons.length" class="grid grid-cols-4 gap-3 mt-6">
			<lessons-card v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" />
		</div>

		<p v-else class="mt-4">No lessons</p>
	</section>
</template>

<script setup>
const route = useRoute();

await useFetch("/api/lessons", { key: "lessons" });

const { data } = useNuxtData("lessons");

const { favourites } = useFavourites();

const isFavourites = computed(() => route.name === "favourites");

const lessons = computed(() => {
	if (!data.value) return [];

	return isFavourites.value ? data.value.filter(lesson => favourites.value.includes(lesson.id)) : data.value;
});
</script>
