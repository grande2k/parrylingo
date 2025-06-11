<template>
	<div
		class="lesson-card aspect-square flex items-center justify-center rounded-xl cursor-pointer"
		:class="playing ? 'bg-[#9db77b]' : 'bg-[#91b377]'"
		@click="startRoulette"
	>
		<div v-if="playing" class="rounded-xl size-48 overflow-hidden">
			<video
				ref="videoRef"
				:src="videoSrc"
				class="scale-105"
				playsinline
				muted
				autoplay
				disablepictureinpicture
				webkit-playsinline
				preload="auto"
				@ended="onVideoEnd"
			></video>
		</div>

		<img v-else src="/images/roulette.png" class="rounded-xl size-48 object-contain" />
	</div>
</template>

<script setup>
const props = defineProps({ count: Number });
const router = useRouter();

const playing = ref(false);
const videoSrc = "/images/roulette.mp4";
const videoRef = ref(null);

const audio = new Audio("/audio/roulette.mp3");
audio.loop = true;

const startRoulette = () => {
	playing.value = true;

	const isSoundDisabled = localStorage.getItem("interface_sound_disabled") === "true";
	if (!isSoundDisabled) audio.play();

	nextTick(() => {
		videoRef.value?.play().catch(() => {
			router.push(`/roulette?count=${props.count}`);
		});
	});
};

const onVideoEnd = () => {
	audio.pause();
	router.push(`/roulette?count=${props.count}`);
};
</script>
