<template>
	<article class="relative rounded-2xl border border-gray-300 pt-12 overflow-hidden">
		<div class="flex gap-2 absolute z-10 right-2 top-2">
			<UButton
				size="md"
				:color="isFav ? 'secondary' : 'neutral'"
				:variant="isFav ? 'solid' : 'subtle'"
				class="cursor-pointer size-8 p-0 flex items-center justify-center"
				@click="addLessonToFavourites"
			>
				<IconHeart class="!size-4" :fill="isFav ? '#fff' : 'none'" />
			</UButton>

			<UButton
				color="neutral"
				variant="subtle"
				class="cursor-pointer size-8 p-0 flex items-center justify-center"
				@click="share"
			>
				<IconShare class="!size-4" />
			</UButton>
		</div>

		<p class="bg-secondary py-1 px-2 text-center text-white">
			{{ lessonInfo }}
		</p>

		<div class="grid grid-cols-2">
			<div
				v-for="word in [lesson.words[0], lesson.words[1]]"
				:key="word.id"
				class="flex items-center justify-center first:border-r border-gray-300"
			>
				<img :src="word.image" class="w-24 h-24 object-contain" alt="" />
			</div>
		</div>
	</article>
</template>

<script setup>
const props = defineProps({
	lesson: { type: Object, required: true },
});

const lessonInfo = computed(() => {
	const authorFullName = `${props.lesson.author?.first_name} ${props.lesson.author?.last_name}`;
	return `${authorFullName} / ${props.lesson.language?.name}`;
});

const { isFavourite, toggleFavourite } = useFavourites();

const isFav = computed(() => isFavourite(props.lesson.id));

const addLessonToFavourites = () => {
	toggleFavourite(props.lesson.id);
};

const share = () => {};
</script>
