<template>
	<header class="pb-4 sm:pb-6 mb-4 sm:mb-6 border-b-[3px] border-gray-200">
		<div class="mb-4 sm:mb-6">
			<img src="/images/logo.jpg" alt="" class="w-60 h-12 sm:w-72 sm:h-16 object-cover mx-auto" />
		</div>

		<nav>
			<ul class="flex items-start justify-center gap-8">
				<li class="header-link">
					<nuxt-link to="/">{{ $t("lessons") }}</nuxt-link>
					<a href="https://look-at-english.com/index_en.html" class="header-sublink">
						{{ $t("old_lessons") }}
					</a>
				</li>
				<li class="header-link">
					<nuxt-link to="/favourites">{{ $t("favourites") }}</nuxt-link>
				</li>
			</ul>
		</nav>

		<button
			class="settings-toggle-button absolute top-4 right-4 z-20 text-white bg-gray-600 flex items-center justify-center size-8 rounded-full cursor-pointer"
			@click="showSettings = !showSettings"
		>
			<IconSettings class="size-4" />
		</button>

		<Settings v-show="showSettings" @close="showSettings = false" />
	</header>
</template>

<script setup>
const showSettings = ref(false);
</script>

<style scoped>
@reference "@/assets/css/main.css";

.header-link a {
	@apply underline;
}

.header-link a:not(.header-sublink) {
	@apply text-xl sm:text-2xl text-black font-semibold;
}

.header-sublink {
	@apply text-xs sm:text-sm block mt-1 font-semibold;
}

.header-link a.router-link-exact-active {
	@apply text-primary no-underline text-3xl leading-none;
}
</style>
