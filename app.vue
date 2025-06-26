<template>
	<div class="relative max-w-5xl w-full mx-auto py-4 px-4 sm:py-8" id="container">
		<Header />

		<div class="mb-8">
			<template v-if="route.name === 'index' && !Object.keys(route.query).length">
				<h4 v-if="$t('footer_title')" class="whitespace-pre-line font-bold">
					{{ $t("footer_title") }}
				</h4>

				<p v-if="$t('footer_text')" class="whitespace-pre-line text-sm">
					{{ $t("footer_text") }}
				</p>
			</template>

			<button
				class="h-9 bg-gray-300 text-black font-semibold border border-black rounded-2xl py-1 px-3 flex items-center gap-2 mt-4 mx-auto cursor-pointer"
				@click="handleLinkClick"
			>
				<img src="/favicon.ico" class="size-7" alt="" />
				{{ $t("appstore_button") }}
			</button>
		</div>

		<main>
			<NuxtPage />

			<a
				v-if="!['lesson_id', 'roulette'].includes(route.name)"
				href="https://look-at-english.com/index_en.html"
				class="block mt-8 font-semibold underline underline-offset-4"
			>
				{{ $t("old_lessons") }}
			</a>
		</main>
	</div>
</template>

<script setup>
const { t, locale } = useI18n();
const { showToast } = useToast();
const route = useRoute();

watchEffect(() => {
	useHead({
		title: t("meta_title"),
		meta: [
			{ name: "description", content: t("meta_description") },
			{ name: "keywords", content: t("meta_keywords") },
		],
	});
});

const formatAppStoreQuery = term => {
	return encodeURIComponent(term.trim().replace(/\s+/g, "+"));
};

const handleLinkClick = async () => {
	if (isiOS()) {
		const searchTerm = formatAppStoreQuery(t("appstore_search"));
		const deepLink = `itms-apps://search.itunes.apple.com/WebObjects/MZSearch.woa/wa/search?media=software&term=${searchTerm}`;
		window.location.href = deepLink;
	} else {
		const url = "https://apps.apple.com/app/parrylingo-language-learning/id1439733300";

		if (navigator.clipboard) {
			await navigator.clipboard.writeText(url);
			showToast(t("copy_success"), 2000, "success");
		} else {
			unsecuredCopyToClipboard(url);
			showToast(t("copy_success"), 2000, "success");
		}
	}
};
</script>
