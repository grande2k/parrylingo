<template>
	<form @submit.prevent="onSubmit">
		<SharedAvatarSelector v-model="state.avatar_id" :avatars="avatars?.items || []" class="mb-4" />
		<SharedInput v-model="state.email" :label="$t('email')" type="email" class="mb-2" />
		<SharedInput v-model="state.name" :label="$t('name')" class="mb-2" />
		<SharedInput v-model="state.password" :label="$t('password')" class="mb-4" />
		<SharedInput v-model="repeat_password" :label="$t('repeat_password')" class="mb-4" />
		<p v-if="error" class="text-red-500 text-xs tracking-wide mb-3">{{ error }}</p>
		<button
			type="submit"
			class="block w-full bg-secondary py-2 px-6 text-white rounded-full font-semibold cursor-pointer mb-2"
			:class="{ 'opacity-50': loading }"
			:disabled="loading"
		>
			{{ $t("sign_up") }}
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
</template>

<script setup>
const { t } = useI18n({ useScope: "global" });
const { showToast } = useToast();
const avatars = ref(null);
const state = reactive({ avatar_id: "", email: "", name: "", password: "" });
const repeat_password = ref("");
const error = ref("");
const loading = ref(false);
const emit = defineEmits(["close", "success"]);

const onSubmit = async () => {
	error.value = "";

	if (!state.email.trim() || !state.password.trim() || !state.name.trim()) {
		error.value = t("fill_all_fields");
		return;
	} else if (state.password !== repeat_password.value) {
		error.value = t("passwords_dont_match");
		return;
	}

	loading.value = true;

	const { error: err } = await useAPI("/signup", { method: "POST", body: state });

	loading.value = false;

	if (err.value) {
		showToast(t("error"), 2000, "error");
	} else {
		showToast(t("signup_success"), 2000, "success");
		localStorage.setItem("auth_canceled", "true");
		emit("success");
	}
};

const fetchAvatars = async () => {
	const { data, error } = await useAPI("/admin/avatars", { query: { size: 100 } });

	if (error.value) {
		console.error("Ошибка при загрузке аватарок", error.value);
		return;
	}

	avatars.value = data.value;

	state.avatar_id = data.value.items[0].id;
};

onMounted(fetchAvatars);

const close = () => emit("close");
</script>
