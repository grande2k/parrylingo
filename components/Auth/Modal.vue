<template>
	<div
		class="fixed inset-0 bg-black/15 -z-1 flex items-center justify-center transition duration"
		:class="{ 'opacity-0': !open, 'opacity-100 z-50': open }"
	>
		<div
			class="bg-white py-4 px-6 sm:px-8 rounded-full size-[380px] sm:size-[400px] text-center drop-shadow-2xl flex flex-col items-center justify-center"
			:class="{ '!w-[340px] sm:!w-[400px] !size-auto !h-[540px] sm:!h-[580px] !rounded-2xl': signupOpen }"
		>
			<template v-if="loginOpen">
				<AuthLogin @close="close" />
			</template>

			<template v-else-if="signupOpen">
				<AuthSignup
					@close="close"
					@success="
						loginOpen = true;
						signupOpen = false;
					"
				/>
			</template>

			<template v-else>
				<p class="sm:text-xl font-semibold text-center">{{ $t("auth_text") }}</p>

				<div class="flex justify-center gap-4 mt-4">
					<button
						class="bg-secondary py-2 px-6 text-white text-lg rounded-full font-semibold cursor-pointer"
						@click="loginOpen = true"
					>
						{{ $t("sign_in") }}
					</button>

					<button
						class="bg-secondary py-2 px-6 text-white text-lg rounded-full font-semibold cursor-pointer"
						@click="signupOpen = true"
					>
						{{ $t("sign_up") }}
					</button>

					<button
						class="bg-dark-gray py-2 px-6 absolute bottom-8 left-1/2 -translate-x-1/2 text-white sm:text-lg rounded-full font-semibold cursor-pointer"
						@click="close"
					>
						{{ $t("cancel") }}
					</button>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({ open: Boolean, screen: String });

const emit = defineEmits(["close"]);

const loginOpen = ref(false);
const signupOpen = ref(false);

const close = () => {
	localStorage.setItem("auth_canceled", "true");
	emit("close");
};

watch(
	() => props.screen,
	newScreen => {
		if (newScreen === "login") {
			loginOpen.value = true;
			signupOpen.value = false;
		} else if (newScreen === "signup") {
			loginOpen.value = false;
			signupOpen.value = true;
		}
	}
);
</script>
