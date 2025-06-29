<template>
	<div
		class="fixed inset-0 bg-black/15 -z-1 flex items-center justify-center transition duration"
		:class="{ 'opacity-0': !open, 'opacity-100 z-50': open }"
	>
		<div
			class="bg-white py-4 px-6 sm:px-8 rounded-full size-[380px] sm:size-[400px] text-center drop-shadow-2xl flex flex-col items-center justify-center"
		>
			<form @submit.prevent="onSubmit">
				<SharedAvatarSelector v-model="state.avatar_id" :avatars="avatars?.items || []" class="mb-4" />
				<SharedInput v-model="state.name" :label="$t('name')" class="mb-2" />
				<p v-if="error" class="text-red-500 text-xs tracking-wide mb-3">{{ error }}</p>
				<button
					type="submit"
					class="block w-full bg-secondary py-2 px-6 text-white rounded-full font-semibold cursor-pointer mb-2"
					:class="{ 'opacity-50': loading }"
					:disabled="loading"
				>
					{{ $t("save") }}
				</button>
				<button
					type="button"
					class="block w-full bg-dark-gray py-2 px-6 text-white rounded-full font-semibold cursor-pointer"
					:class="{ 'opacity-50': loading }"
					:disabled="loading"
					@click="close"
				>
					{{ $t("cancel") }}
				</button>
			</form>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({ open: Boolean });
const { t } = useI18n({ useScope: "global" });
const { showToast } = useToast();
const profileStore = useProfileStore();
const avatars = ref(null);
const state = reactive({ avatar_id: "", name: "" });
const error = ref("");
const loading = ref(false);
const emit = defineEmits(["close"]);

const onSubmit = async () => {
	error.value = "";

	const modifiedFields = Object.keys(state).filter(key => {
		if (key === "avatar_id") {
			return state[key] !== profileStore.profile.avatar.id;
		}

		return state[key] !== profileStore.profile[key];
	});

	if (modifiedFields.length === 0) {
		emit("close");
		return;
	}

	if (!state.name.trim()) {
		error.value = t("fill_all_fields");
		return;
	}

	const body = {};

	for (const field of modifiedFields) {
		body[field] = state[field];
	}

	loading.value = true;

	const { error: err } = await useAPI("/user/profile", { method: "PATCH", body });

	loading.value = false;

	if (err.value) {
		showToast(t("error"), 2000, "error");
	} else {
		showToast(t("update_profile_success"), 2000, "success");
		profileStore.fetchProfile();
		close();
	}
};

const fetchAvatars = async () => {
	const { data, error } = await useAPI("/admin/avatars", { query: { size: 100 } });

	if (error.value) {
		console.error("Ошибка при загрузке аватарок", error.value);
		return;
	}

	avatars.value = data.value;
};

const close = () => emit("close");

onMounted(fetchAvatars);

watch(
	() => profileStore.profile,
	newProfile => {
		if (!newProfile) return;
		state.avatar_id = newProfile.avatar.id;
		state.name = newProfile.name;
	}
);
</script>
