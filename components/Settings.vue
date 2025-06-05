<template>
	<div
		class="absolute top-3 right-3 z-10 bg-gray-300 drop-shadow-lg rounded-xl p-4 pt-12 space-y-3"
		ref="settingsRef"
	>
		<div class="flex items-center justify-between gap-4">
			<span class="text-sm text-black font-semibold">Звуки интерфейса: </span>
			<Switcher storageKey="interface_sound_disabled" :defaultValue="false" @update="toggleInterfaceSound" />
		</div>

		<div class="flex items-center justify-between gap-4">
			<span class="text-sm text-black font-semibold">Озвучка слова: </span>
			<Switcher storageKey="lesson_sound_disabled" :defaultValue="false" @update="toggleLessonSound" />
		</div>
	</div>
</template>

<script setup>
const emit = defineEmits(["close"]);

const isLessonSoundDisabled = ref(false);
const isLessonInterfaceDisabled = ref(false);

const settingsRef = ref(null);

const toggleInterfaceSound = enabled => {
	console.log(enabled);
};

const toggleLessonSound = enabled => {
	console.log(enabled);
};

const handleClickOutside = event => {
	if (!settingsRef.value) return;

	if (event.target.closest(".settings-toggle-button")) return;

	if (!(settingsRef.value === event.target || settingsRef.value.contains(event.target))) {
		emit("close");
	}
};

onMounted(async () => {
	isLessonSoundDisabled.value = localStorage.getItem("lesson_sound_disabled") === "true";
	isLessonInterfaceDisabled.value = localStorage.getItem("interface_sound_disabled") === "true";

	nextTick(() => {
		document.addEventListener("click", handleClickOutside);
	});
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>
