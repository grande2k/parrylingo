<template>
	<div>
		<LoadingSpinner v-if="loading" class="mx-auto mt-24" />
		<p v-else-if="failed" class="text-center font-medium text-error-500">Failed to fetch leaderboard</p>
		<ul v-else class="space-y-3">
			<li v-for="(row, index) in rows" :key="row.name" class="flex items-center gap-2 sm:gap-4">
				<div class="size-12 sm:size-16 bg-white flex items-center justify-center shrink-0">
					<img
						v-if="index + 1 === 1"
						src="/images/medal-gold.png"
						class="size-8 sm:size-12 drop-shadow"
						alt="gold medal"
					/>

					<img
						v-else-if="index + 1 === 2"
						src="/images/medal-silver.png"
						class="size-8 sm:size-12 drop-shadow"
						alt="silver medal"
					/>

					<img
						v-else-if="index + 1 === 3"
						src="/images/medal-bronze.png"
						class="size-8 sm:size-12 drop-shadow"
						alt="bronze medal"
					/>
				</div>

				<div
					class="flex-auto grid grid-cols-[16px_1fr_auto] items-center gap-4 bg-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-4 px-4"
					:class="{ 'border-2 border-gray-500': row.is_me }"
				>
					<span class="sm:text-lg font-bold">{{ index + 1 }}</span>

					<div class="flex gap-2 items-center">
						<img :src="row.avatar" class="size-6 sm:size-8 drop-shadow rounded-full" />
						<span
							class="font-medium text-gray-500"
							:class="{ 'sm:text-xl text-gray-950 font-bold': row.is_me }"
						>
							{{ row.name }}
						</span>
					</div>

					<div class="flex items-center justify-end gap-1 text-amber-400 sm:text-xl leading-none font-bold">
						<img src="/images/star-gold.png" class="size-6 sm:size-8" alt="star" />
						{{ row.total_stars }}
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
const languageStore = useLanguageStore();

const leaderboard = ref(null);
const loading = ref(true);
const failed = ref(false);

const rows = computed(() => {
	if (!leaderboard.value) return [];

	const currentId = leaderboard.value.current_user_result?.id;
	const users = leaderboard.value.top_users || [];

	const output = users
		.filter(u => u.id !== currentId)
		.map(u => ({
			avatar: getStaticUrl(u.avatar.link),
			name: u.name,
			total_stars: u.total_stars,
		}));

	if (leaderboard.value.current_user_result) {
		const me = leaderboard.value.current_user_result;
		output.push({
			avatar: getStaticUrl(me.avatar.link),
			name: me.name,
			total_stars: me.total_stars,
			is_me: true,
		});
	}

	return output.sort((a, b) => b.total_stars - a.total_stars);
});

const fetchLeaderboard = async () => {
	failed.value = false;
	const lang_id = languageStore.language?.id;

	if (!lang_id) {
		failed.value = true;
		return;
	}

	loading.value = true;

	const { data, error } = await useAPI(`/leaderboard/${lang_id}`);

	loading.value = false;

	if (error.value) {
		failed.value = true;
		return;
	} else {
		leaderboard.value = data.value;
	}
};

onMounted(fetchLeaderboard);

watch(
	() => languageStore.language,
	v => {
		if (v && v.id) fetchLeaderboard();
	}
);
</script>
