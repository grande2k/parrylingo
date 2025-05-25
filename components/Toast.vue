<template>
	<div
		class="fixed top-6 right-6 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow transition duration-300"
		:class="{ 'opacity-0 -z-1': !visible, 'opacity-100 z-50': visible }"
		:key="message"
	>
		{{ message }}
	</div>
</template>

<script setup>
const props = defineProps({
	visible: Boolean,
	message: String,
	duration: {
		type: Number,
		default: 2000,
	},
});

const emit = defineEmits(["close"]);

watch(
	() => props.visible,
	newVal => {
		if (newVal) {
			setTimeout(() => {
				emit("close");
			}, props.duration);
		}
	},
	{ immediate: true }
);
</script>
