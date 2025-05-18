<template>
	<div class="puzzle-mask relative" v-bind="$attrs">
		<img :src="imageUrl" class="absolute w-[100%] h-[100%] z-1" alt="" />
		<img v-if="direction === 'left'" src="/puzzle_mask_left.PNG" class="absolute w-[100%] h-[100%] z-2" alt="" />
		<img
			v-else-if="direction === 'right'"
			src="/puzzle_mask_right.PNG"
			class="absolute w-[100%] h-[100%] z-2"
			alt=""
		/>
	</div>
</template>

<script setup>
defineProps({
	imageUrl: {
		type: String,
		required: true,
	},
	direction: {
		type: String,
		required: false,
		default: "left",
	},
});
</script>
