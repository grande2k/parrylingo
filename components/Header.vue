<template>
	<header class="pb-4 sm:pb-6 mb-4 sm:mb-6 pt-8 border-b-[3px] border-gray-200">
		<nuxt-link to="/" class="block mb-4 sm:mb-6">
			<img src="/images/logo.jpg" alt="" class="w-60 h-12 sm:w-72 sm:h-16 object-cover mx-auto" />
		</nuxt-link>

		<language-picker />

		<nav class="mt-4 sm:mt-6">
			<ul class="flex items-start justify-center gap-8">
				<li class="header-link" :class="{ ignore: route.query.user_id }">
					<nuxt-link to="/">{{ $t("lessons") }}</nuxt-link>
				</li>
				<li class="header-link">
					<nuxt-link to="/favourites">{{ $t("favourites") }}</nuxt-link>
				</li>
			</ul>
		</nav>

		<button
			class="settings-toggle-button absolute top-4 right-4 z-40 text-white bg-gray-600 flex items-center justify-center rounded-full cursor-pointer"
			:class="{ 'size-8': !profile, 'p-1': profile }"
			@click="showSettings = !showSettings"
		>
			<template v-if="profile">
				<div class="flex items-center gap-2 mr-4">
					<img :src="getStaticUrl(profile.avatar.link)" class="size-6 rounded-full" alt="" />
					<p class="text-sm">{{ profile.name }}</p>
					<IconPencil v-if="showSettings" class="size-3" @click.stop="openProfileEditModal" />
				</div>

				<div class="flex items-center gap-1 mr-2">
					<IconStar class="size-3 fill-amber-300" />
					<p class="text-sm leading-none font-bold">{{ profile.total_stars }}</p>
				</div>
			</template>

			<IconSettings class="size-4" />
		</button>

		<Settings v-if="showSettings" @close="showSettings = false" />

		<AuthProfileEditModal :open="showEditModal" @close="closeEditModal" />
	</header>
</template>

<script setup>
const showSettings = ref(false);
const route = useRoute();

const profileStore = useProfileStore();
const profile = computed(() => profileStore.profile);

const showEditModal = ref(false);

const openProfileEditModal = () => {
	showEditModal.value = true;
	showSettings.value = false;
};

const closeEditModal = () => {
	showEditModal.value = false;
	showSettings.value = false;
};

onMounted(profileStore.fetchProfile);
</script>

<style scoped>
@reference "@/assets/css/main.css";

.header-link a {
	@apply underline;
}

.header-link a:not(.header-sublink) {
	@apply text-xl sm:text-2xl text-black font-semibold;
}

.header-link:not(.ignore) a.router-link-exact-active {
	@apply text-primary no-underline text-3xl leading-none;
}
</style>
