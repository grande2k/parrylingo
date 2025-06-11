<template>
	<LoadingSpinner v-if="rouletteStore.loading" class="mx-auto mt-24" />

	<div v-if="!rouletteStore.loading && rouletteStore.words.length" class="max-w-[600px] mx-auto">
		<div class="flex items-center justify-center gap-1 mb-4 sm:mb-6">
			<button @click="goBack" class="rounded cursor-pointer pr-1">
				<IconBack class="size-4" />
			</button>
			<p class="text-center underline underline-offset-4">{{ rouletteStore.language?.name }}</p>
		</div>

		<RouletteSteps />
		<RouletteTask />
	</div>

	<Teleport to="body">
		<div v-if="showStart" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
			<button
				class="bg-secondary rounded-full border-4 uppercase text-white text-3xl py-4 px-8 cursor-pointer leading-none font-bold tracking-wide"
				@click="startRoulette"
			>
				{{ $t("start") }}
			</button>
		</div>
	</Teleport>
</template>

<script setup>
const route = useRoute();
const rouletteStore = useRouletteStore();
const showStart = ref(false);

const startRoulette = () => {
	showStart.value = false;
	rouletteStore.playAudio();
};

const goBack = () => {
	navigateTo("/");
};

onMounted(async () => {
	const langId = localStorage.getItem("language_id");
	const count = Number(route.query.count) || 4;

	rouletteStore.reset();
	await rouletteStore.loadRoulette(langId, count);
	showStart.value = true;
});
</script>
