<template>
	<section class="lessons">
		<p v-if="route.query.user_id && lessonsStore.user" class="text-center mb-4">
			Lessons by <strong>{{ lessonsStore.user.name }}</strong>
		</p>

		<div v-if="!route.query.user_id" class="flex flex-col sm:flex-row items-center justify-between gap-2">
			<CategoriesFilter />
			<SharedSearchInput v-model="lessonsStore.filters.search" />
		</div>

		<LoadingSpinner v-if="lessonsStore.loading" class="mx-auto mt-24" />

		<div v-if="lessons.length && !lessonsStore.loading" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
			<component
				v-for="lesson in lessons"
				:key="lesson.id || lesson.count"
				:is="lesson.type === 'roulette' ? LessonsRouletteCard : LessonsCard"
				v-bind="lesson"
				:lesson="lesson"
				@click="lesson.type !== 'roulette' && $router.push(`/${lesson.id}`)"
			/>
		</div>

		<p v-else-if="!lessonsStore.loading && !lessons?.length" class="mt-12 text-center">{{ $t("no_lessons") }}</p>
	</section>
</template>

<script setup>
const LessonsRouletteCard = resolveComponent("LessonsRouletteCard");
const LessonsCard = resolveComponent("LessonsCard");

const lessonsStore = useLessonsStore();
const route = useRoute();

const { favourites } = useFavourites();

const isFavourites = computed(() => route.name === "favourites");

const lessons = computed(() => {
	const list = lessonsStore.lessons ?? [];
	const result = isFavourites.value ? list.filter(l => favourites.value.includes(l.id)) : list;

	const showShortRoulette = result.length >= 2 && !isFavourites.value;
	const showLongRoulette = result.length > 9 && !isFavourites.value;

	const output = [...result];
	if (showShortRoulette) output.unshift({ type: "roulette", count: 4 });
	if (showLongRoulette) output.push({ type: "roulette", count: 18 });

	return output;
});

onMounted(() => {
	if (route.query.user_id) {
		lessonsStore.fetchUserLessons(route.query.user_id, route.query.language_id);
	}
});
</script>
