<template>
	<div
		class="lesson-card flex items-center justify-center rounded-xl cursor-pointer"
		:class="playing ? 'bg-[#9db77b]' : 'bg-[#91b377]'"
		@click="startRoulette"
	>
		<div v-if="playing" class="rounded-xl w-36 h-auto overflow-hidden">
			<video
				ref="videoRef"
				:src="videoSrc"
				class="video"
				playsinline
				muted
				autoplay
				disablepictureinpicture
				webkit-playsinline
				preload="auto"
				@ended="onVideoEnd"
			></video>
		</div>

		<img v-else src="/images/roulette.png" class="rounded-xl w-36 h-auto object-contain" />
	</div>
</template>

<script setup>
const props = defineProps({ count: Number });
const router = useRouter();

const playing = ref(false);
const videoSrc = "/images/roulette.mp4";
const videoRef = ref(null);

const startRoulette = () => {
	playing.value = true;

	nextTick(() => {
		videoRef.value?.play().catch(() => {
			router.push(`/roulette?count=${props.count}`);
		});
	});
};

const onVideoEnd = () => {
	router.push(`/roulette?count=${props.count}`);
};
</script>

<style scoped>
.video {
	transform: scale(1.025);
	object-fit: cover;
}
</style>
