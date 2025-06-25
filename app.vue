<template>
	<div class="relative max-w-5xl w-full mx-auto py-4 px-4 sm:py-8" id="container">
		<Header />

		<main>
			<NuxtPage />
		</main>
	</div>
</template>

<script setup>
const { t, locale } = useI18n();

watchEffect(() => {
	useHead({
		title: t("meta_title"),
		meta: [
			{ name: "description", content: t("meta_description") },
			{ name: "keywords", content: t("meta_keywords") },
		],
	});
});
</script>
