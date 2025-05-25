<template>
	<header class="pb-4 sm:pb-6 mb-4 sm:mb-6 border-b-[3px] border-gray-200">
		<div class="flex items-center justify-center gap-4 mb-6">
			<img src="/images/logo.webp" width="56px" alt="" />
			<h1 class="text-3xl font-black">ParryLingo</h1>
		</div>

		<nav>
			<ul class="flex items-center justify-center gap-8">
				<li class="header-link">
					<nuxt-link to="/">Lessons</nuxt-link>
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
	@apply text-2xl text-black;
}

.header-link a.router-link-exact-active {
	@apply text-primary;
}
</style>
