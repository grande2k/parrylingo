<template>
	<section class="lessons">
		<language-picker />

		<LoadingSpinner v-if="lessonsStore.loading" class="mx-auto mt-24" />

		<div v-if="lessons.length && !lessonsStore.loading" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
			<lessons-card
				v-for="lesson in lessons"
				:key="lesson.id"
				:lesson="lesson"
				@click="$router.push(`/${lesson.id}`)"
			/>
		</div>

		<p v-else-if="!lessonsStore.loading && !lessons?.length" class="mt-12 text-center">No lessons</p>
	</section>
</template>

<script setup>
const lessonsStore = useLessonsStore();
const route = useRoute();

const { favourites } = useFavourites();

const isFavourites = computed(() => route.name === "favourites");

onMounted(() => {
	lessonsStore.fetchLessons();
});

const lessons = computed(() => {
	if (!lessonsStore.lessons) return [];

	return isFavourites.value
		? lessonsStore.lessons.filter(lesson => favourites.value.includes(lesson.id))
		: lessonsStore.lessons;
});
</script>
