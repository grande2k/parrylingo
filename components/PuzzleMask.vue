<template>
	<div class="p-[2.5%] bg-gray-100" v-bind="$attrs">
		<div class="puzzle-mask relative w-full h-full">
			<img
				v-if="!empty"
				:src="fullImageUrl"
				class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] object-contain z-1"
				alt=""
			/>
			<img v-else src="/images/puzzle_mask_empty.PNG" class="absolute w-[100%] h-[100%] z-2" alt="" />

			<img
				v-if="!empty && direction === 'left'"
				src="/images/puzzle_mask_left.PNG"
				class="absolute w-[100%] h-[100%] z-2"
				alt=""
			/>
			<img
				v-else-if="!empty && direction === 'right'"
				src="/images/puzzle_mask_right.PNG"
				class="absolute w-[100%] h-[100%] z-2"
				alt=""
			/>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	imageUrl: String,
	empty: Boolean,
	direction: { type: String, required: false, default: "left" },
});

const fullImageUrl = computed(() => getStaticUrl(props.imageUrl));
</script>
