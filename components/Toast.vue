<template>
	<div
		class="fixed w-fit top-6 left-1/2 max-sm:-translate-x-1/2 sm:right-6 sm:left-[unset] opacity-100 z-50 text-sm px-4 py-2 rounded-lg shadow transition duration-300"
		:class="{
			'opacity-0 -z-1': !visible,
			'opacity-100 z-50': visible,
			'bg-gray-800 text-white': color === 'default',
			'bg-green-500 text-white': color === 'success',
			'bg-red-500 text-white': color === 'error',
		}"
		:key="message"
	>
		{{ message }}
	</div>
</template>

<script setup>
const props = defineProps({
	visible: Boolean,
	message: String,
	color: String,
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
