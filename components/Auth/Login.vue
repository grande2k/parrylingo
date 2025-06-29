<template>
	<form @submit.prevent="onSubmit">
		<SharedInput v-model="state.email" :label="$t('email')" type="email" class="mb-2" />
		<SharedInput v-model="state.password" :label="$t('password')" class="mb-4" />
		<p v-if="error" class="text-red-500 text-xs tracking-wide mb-3">{{ error }}</p>
		<button
			type="submit"
			class="block w-full bg-secondary py-2 px-6 text-white rounded-full font-semibold cursor-pointer mb-2"
		>
			{{ $t("sign_in") }}
		</button>
		<button
			type="button"
			class="block w-full bg-dark-gray py-2 px-6 text-white rounded-full font-semibold cursor-pointer"
			@click="close"
		>
			{{ $t("cancel") }}
		</button>
	</form>
</template>

<script setup>
const { t } = useI18n({ useScope: "global" });
const { showToast } = useToast();
const state = reactive({ email: "", password: "" });
const error = ref("");
const loading = ref(false);
const emit = defineEmits(["close"]);

const onSubmit = async () => {
	error.value = "";

	if (!state.email.trim() || !state.password.trim()) {
		error.value = t("fill_all_fields");
		return;
	}

	loading.value = true;

	const { data, error: err } = await useAPI("/login", { method: "POST", body: state });

	loading.value = false;

	if (err.value) {
		if (err.value.statusCode === 404) error.value = t("user_not_found");
		else if (err.value.statusCode === 400) error.value = t("incorect_password");
		else showToast(t("error"), 2000, "error");
	} else {
		showToast(t("login_success"), 2000, "success");
		useCookie("access_token").value = data.value.access_token;
		useCookie("refresh_token").value = data.value.refresh_token;
		await navigateTo("/");
		location.reload();
	}
};

const close = () => emit("close");
</script>
