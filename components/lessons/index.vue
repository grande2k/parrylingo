<template>
	<section class="lessons">
		<language-picker />

		<div v-if="lessons.length" class="grid grid-cols-4 gap-3 mt-6">
			<lessons-card
				v-for="lesson in lessons"
				:key="lesson.id"
				:lesson="lesson"
				@click="$router.push(`/${lesson.id}`)"
			/>
		</div>

		<p v-else class="mt-4">No lessons</p>
	</section>
</template>

<script setup>
const lessonsStore = useLessonsStore();
const route = useRoute();

const { favourites } = useFavourites();

const isFavourites = computed(() => route.name === "favourites");

onMounted(async () => {
	lessonsStore.fetchLessons();
});

const lessons = computed(() => {
	if (!lessonsStore.lessons) return [];

	return isFavourites.value
		? lessonsStore.lessons.filter(lesson => favourites.value.includes(lesson.id))
		: lessonsStore.lessons;
});
</script>
