<template>
	<div class="absolute top-3 right-3 z-10 bg-gray-300 rounded-xl p-4 pt-12 space-y-3" ref="settingsRef">
		<div class="flex items-center justify-between gap-4">
			<span class="text-sm text-black font-semibold">{{ $t("interface_sounds") }}: </span>
			<Switcher storageKey="interface_sound_disabled" :defaultValue="false" />
		</div>

		<div class="flex items-center justify-between gap-4">
			<span class="text-sm text-black font-semibold">{{ $t("word_sounds") }}: </span>
			<Switcher storageKey="lesson_sound_disabled" :defaultValue="false" />
		</div>

		<div v-if="interfaces && interfaces.length">
			<span class="text-sm text-black font-semibold">{{ $t("interface_languages") }}: </span>

			<div class="grid grid-cols-6 gap-2">
				<div
					v-for="item in sortedInterfaces"
					:key="item.language_code"
					class="px-1.5 cursor-pointer"
					:class="{ 'bg-gray-25/50 rounded': item.language_code === selectedInterface.language_code }"
					@click="setInterfaceLanguage(item.language_code)"
				>
					<span :class="`block fi fi-${item.flag_code}`"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const emit = defineEmits(["close"]);

const isLessonInterfaceDisabled = ref(false);
const settingsRef = ref(null);
const interfaces = useState("interfaces", () => null);

const i18n = useI18n();
const selectedLang = ref(null);

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
	if (!interfaces.value || !selectedLang.value) return interfaces.value ?? [];
	return [
		...interfaces.value.filter(i => i.language_code === selectedLang.value),
		...interfaces.value.filter(i => i.language_code !== selectedLang.value),
	];
});

const setInterfaceLanguage = newLang => {
	localStorage.setItem("interface_language", newLang);
	selectedLang.value = newLang;
	i18n.locale.value = newLang;
};

onMounted(async () => {
	isLessonInterfaceDisabled.value = localStorage.getItem("interface_sound_disabled") === "true";
	selectedLang.value = localStorage.getItem("interface_language") || i18n.locale.value;
	nextTick(() => {
		document.addEventListener("click", handleClickOutside);
	});
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>
