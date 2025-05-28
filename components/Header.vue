<template>
	<header class="pb-4 sm:pb-6 mb-4 sm:mb-6 border-b-[3px] border-gray-200">
		<div class="mb-6">
			<img src="/images/logo.jpg" alt="" class="w-64 sm:w-48 h-12 sm:h-10 sm:w-72 sm:h-16 object-cover mx-auto" />
		</div>

		<nav>
			<ul class="flex items-start justify-center gap-8">
				<li class="header-link">
					<nuxt-link to="/">Lessons</nuxt-link>
					<a href="https://look-at-english.com/" class="header-sublink">Old Lessons</a>
				</li>
				<li class="header-link">
					<nuxt-link to="/favourites">Favourites</nuxt-link>
				</li>
			</ul>
		</nav>
	</header>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.header-link a {
	@apply underline;
}

.header-link a:not(.header-sublink) {
	@apply text-2xl text-black font-semibold;
}

.header-sublink {
	@apply text-sm block mt-1 font-semibold;
}

.header-link a.router-link-exact-active {
	@apply text-primary no-underline text-3xl leading-none;
}
</style>
