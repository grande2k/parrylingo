<template>
	<div class="absolute top-3 right-3 z-30 bg-gray-300 rounded-xl p-4 pt-12 space-y-3" ref="settingsRef">
		<div class="flex items-center justify-between gap-4">
			<span class="text-sm text-black font-semibold">{{ $t("interface_sounds") }}: </span>
			<Switcher storageKey="interface_sound_disabled" :defaultValue="false" />
		</div>

		<div
			class="flex items-center justify-between gap-4"
			:class="{ 'opacity-45 pointer-events-none': isWordVisibilityDisabled }"
		>
			<span class="text-sm text-black font-semibold">{{ $t("word_sounds") }}: </span>
			<Switcher storageKey="lesson_sound_disabled" :defaultValue="false" />
		</div>

		<div
			class="flex items-center justify-between gap-4"
			:class="{ 'opacity-45 pointer-events-none': isLessonSoundDisabled }"
		>
			<span class="text-sm text-black font-semibold">{{ $t("word_visibility") }}: </span>
			<Switcher storageKey="word_visibility_disabled" :defaultValue="false" />
		</div>

		<div class="flex items-center justify-between gap-4">
			<span class="text-sm text-black font-semibold">{{ $t("timer") }}: </span>
			<Switcher storageKey="timerDisabled" :defaultValue="false" />
		</div>

		<div v-if="interfaces && interfaces.length">
			<span class="text-sm text-black font-semibold"
				>{{ $t("interface_languages") }}: {{ selectedInterface.name }}
			</span>

			<div class="grid grid-cols-6 gap-2">
				<div
					v-for="item in sortedInterfaces"
					:key="item.language_code"
					:title="item.name"
					class="px-1.5 cursor-pointer"
					:class="{
						'bg-gray-25/50 rounded scale-120': item.language_code === selectedInterface.language_code,
					}"
					@click="setInterfaceLanguage(item.language_code)"
				>
					<span
						:class="[
							`block fi fi-${item.flag_code}`,
							{ 'scale-110': item.language_code === selectedInterface.language_code },
						]"
					></span>
				</div>
			</div>
		</div>

		<template v-if="useCookie('access_token').value">
			<button
				class="block bg-secondary py-2 px-6 text-white rounded-full font-semibold cursor-pointer mb-0 mt-6 mx-auto"
				@click="logout"
			>
				{{ $t("log_out") }}
			</button>
		</template>

		<template v-else>
			<button
				class="block w-full bg-secondary py-2 px-6 text-white rounded-full font-semibold cursor-pointer"
				@click="openSignInModal"
			>
				{{ $t("sign_in") }}
			</button>

			<button
				class="block w-full bg-secondary py-2 px-6 text-white rounded-full font-semibold cursor-pointer mt-1 mb-0"
				@click="openSignUpModal"
			>
				{{ $t("sign_up") }}
			</button>
		</template>

		<AuthModal v-show="authModal" :open="authModal" :screen="authScreen" @close="closeAuthModal" />
	</div>
</template>

<script setup>
const emit = defineEmits(["close"]);

const isLessonInterfaceDisabled = ref(false);
const settingsRef = ref(null);
const interfaces = useState("interfaces", () => null);

const i18n = useI18n();
const selectedLang = ref(null);

const authModal = ref(false);
const authScreen = ref(null);

const isLessonSoundDisabled = useState("lessonSoundDisabled");
const isWordVisibilityDisabled = useState("wordVisibilityDisabled");
const timerDisabled = useState("timerDisabled");

const handleClickOutside = event => {
	if (!settingsRef.value) return;
	if (event.target.closest(".settings-toggle-button")) return;
	if (!(settingsRef.value === event.target || settingsRef.value.contains(event.target))) {
		emit("close");
	}
};

const selectedInterface = computed(() => {
	if (!interfaces.value || !selectedLang.value) return {};
	return interfaces.value.find(item => item.language_code === selectedLang.value) || {};
});

const sortedInterfaces = computed(() => {
	if (!interfaces.value) return [];

	return [...interfaces.value].sort((a, b) => a.language_code.localeCompare(b.language_code));
});

const setInterfaceLanguage = newLang => {
	localStorage.setItem("interface_language", newLang);
	selectedLang.value = newLang;
	i18n.locale.value = newLang;
};

const openSignInModal = () => {
	authModal.value = true;
	authScreen.value = "login";
};

const openSignUpModal = () => {
	authModal.value = true;
	authScreen.value = "signup";
};

const closeAuthModal = () => {
	authModal.value = false;
	authScreen.value = null;
	emit("close");
};

const logout = async () => {
	useCookie("access_token").value = null;
	useCookie("refresh_token").value = null;
	emit("close");
	await navigateTo("/");
	location.reload();
};

onMounted(async () => {
	isLessonInterfaceDisabled.value = localStorage.getItem("interface_sound_disabled") === "true";
	selectedLang.value = localStorage.getItem("interface_language") || i18n.locale.value;
	await nextTick(() => {
		document.addEventListener("click", handleClickOutside);
	});
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>
