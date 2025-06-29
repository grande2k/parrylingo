<template>
	<div class="flex items-center justify-center space-x-4">
		<button
			type="button"
			@click="prevAvatar"
			class="text-gray-400 hover:text-gray-600 transition cursor-pointer"
			aria-label="Previous avatar"
		>
			<IconArrowLeft />
		</button>

		<div
			class="size-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden text-white font-semibold text-sm uppercase"
		>
			<img
				v-if="currentAvatar?.link"
				:src="getStaticUrl(currentAvatar.link)"
				alt="avatar"
				class="size-full object-cover"
			/>
			<span v-else> AVA </span>
		</div>

		<button
			type="button"
			@click="nextAvatar"
			class="text-gray-400 hover:text-gray-600 transition cursor-pointer"
			aria-label="Next avatar"
		>
			<IconArrowRight />
		</button>
	</div>
</template>

<script setup>
const props = defineProps({
	modelValue: String,
	avatars: {
		type: Array,
		required: true,
	},
});

const emit = defineEmits(["update:modelValue"]);

const currentIndex = computed(() => props.avatars.findIndex(avatar => avatar.id === props.modelValue));

const currentAvatar = computed(() => props.avatars[currentIndex.value] || props.avatars[0]);

const nextAvatar = () => {
	const next = (currentIndex.value + 1) % props.avatars.length;
	emit("update:modelValue", props.avatars[next].id);
};

const prevAvatar = () => {
	const prev = (currentIndex.value - 1 + props.avatars.length) % props.avatars.length;
	emit("update:modelValue", props.avatars[prev].id);
};

watchEffect(() => {
	if (!props.modelValue && props.avatars.length) {
		emit("update:modelValue", props.avatars[0].id);
	}
});
</script>
