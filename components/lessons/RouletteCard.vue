<template>
	<div class="lesson-card rounded-xl bg-[#91b377] cursor-pointer" @click="startRoulette">
		<img src="/images/roulette.jpg" class="rounded-xl w-full h-auto max-h-56 object-contain" />
		<!-- <div class="p-3 text-center">
			<p class="text-lg font-bold">🎲 Random Game</p>
			<p class="text-sm text-gray-500">{{ count }} rounds</p>
		</div> -->
	</div>
</template>

<script setup>
const props = defineProps({ count: Number });
const router = useRouter();

const startRoulette = () => {
	router.push(`/roulette?count=${props.count}`);
};
</script>
