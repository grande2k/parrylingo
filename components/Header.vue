<template>
	<header class="pb-4 sm:pb-6 mb-4 sm:mb-6 border-b-[3px] border-gray-200">
		<div class="mb-6">
			<img src="/images/logo.jpg" alt="" class="w-48 h-10 sm:w-72 sm:h-16 object-cover mx-auto" />
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
