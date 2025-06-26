<template>
	<article
		class="relative flex flex-col rounded-xl sm:rounded-2xl border border-gray-300 overflow-hidden cursor-pointer"
	>
		<button
			class="absolute left-1/2 -translate-x-1/2 z-20 cursor-pointer w-6 h-7 sm:w-8 sm:h-9 flex pt-1.5 sm:pt-2 justify-center fav-btn"
			:class="isFav ? 'bg-secondary' : 'bg-gray-400'"
			@click.stop="addLessonToFavourites"
		>
			<IconPlus class="size-3 sm:size-4" stroke="#fff" />
		</button>

		<button
			class="absolute right-1 top-1 z-20 bg-gray-200 border border-gray-500 rounded-full cursor-pointer size-7 sm:size-8 flex items-center justify-center"
			@click.stop="share"
		>
			<IconShare class="size-3 sm:size-4" />
		</button>

		<div class="grid grid-cols-2 gap-4 p-2 relative z-10">
			<PuzzleMask :imageUrl="lesson.words[0].image" class="size-12 sm:size-14 mx-auto" />
			<PuzzleMask direction="right" :imageUrl="lesson.words[0].image" class="size-12 sm:size-14 mx-auto" />
		</div>

		<p
			class="bg-secondary py-1 px-2 text-sm sm:text-base text-center leading-none text-white min-h-8 flex flex-col justify-center"
		>
			<span v-if="lesson.user" class="leading-tight block">{{ lesson.user.name }}</span>
			<span class="overflow-hidden whitespace-nowrap overflow-ellipsis">{{ lessonWords }}</span>
		</p>

		<div class="grid grid-cols-2 flex-auto">
			<div
				v-for="word in [lesson.words[0], lesson.words[1]]"
				:key="word.id"
				class="flex items-center justify-center first:border-r border-gray-300 p-3"
			>
				<img :src="getStaticUrl(word.image)" class="size-16 sm:size-24 object-contain" alt="" />
			</div>
		</div>
	</article>
</template>

<script setup>
const { t, locale } = useI18n({ useScope: "global" });

const props = defineProps({
	lesson: { type: Object, required: true },
});

const lessonWords = computed(() => {
	const firstWord = getTitleForLang(props.lesson.words[0].titles, locale.value);
	const secondWord = getTitleForLang(props.lesson.words[1].titles, locale.value);
	return `${firstWord} / ${secondWord}`;
});

const { isFavourite, toggleFavourite } = useFavourites();

const { showToast } = useToast();

const isFav = computed(() => isFavourite(props.lesson.id));

const addLessonToFavourites = () => {
	toggleFavourite(props.lesson.id);
};

const share = async () => {
	const url = `${window.location.origin}/${props.lesson.id}`;

	const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
	const canShare = !!navigator.share;

	try {
		if (isMobile && canShare) {
			if (navigator.share) {
				await navigator.share({
					title: document.title,
					url,
				});
			} else {
				unsecuredCopyToClipboard(url);
				showToast(t("copy_success"), 2000, "success");
			}
		} else {
			if (navigator.clipboard) {
				await navigator.clipboard.writeText(url);
				showToast(t("copy_success"), 2000, "success");
			} else {
				unsecuredCopyToClipboard(url);
				showToast(t("copy_success"), 2000, "success");
			}
		}
	} catch (err) {
		showToast(t("copy_error"), 2000, "error");
	}
};
</script>

<style scoped>
.fav-btn {
	clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%);
}
</style>
