<template>
	<div
		class="fixed inset-0 bg-black/15 -z-1 flex items-center justify-center transition duration"
		:class="{ 'opacity-0': !open, 'opacity-100 z-50': open }"
	>
		<!-- Контейнер с result и звёздами -->
		<div class="relative size-[360px] z-10">
			<!-- Звезды вокруг -->
			<template v-if="stepsStatus.length === 18">
				<div
					v-for="(star, i) in stars"
					:key="star.id"
					class="absolute z-10 size-10"
					:style="getCircularStarStyle(i, stepsStatus.length)"
				>
					<img :src="star.img" alt="star" class="size-full" />
				</div>
			</template>

			<!-- Звезды по дуге (4 звезды) -->
			<template v-else-if="stepsStatus.length === 4">
				<div
					v-for="(star, i) in stars"
					:key="star.id"
					class="absolute z-10 size-12"
					:style="getArcStarStyle(i, stepsStatus.length)"
				>
					<img :src="star.img" alt="star" class="size-full" />
				</div>
			</template>

			<!-- Само модальное окно -->
			<div
				class="bg-white rounded-full size-[360px] text-center relative scale-90 opacity-0 transition duration drop-shadow-2xl"
				:class="{ 'scale-100 opacity-100': open }"
			>
				<div
					class="relative flex justify-center items-center h-full z-20 scale-130 transition-transform duration-700"
					:class="{ 'rotate-0': open, 'rotate-[360deg]': !open }"
				>
					<img src="/images/results/result-line.png" class="absolute z-10" />
					<img src="/images/results/result-medal.png" class="absolute z-10" />
					<img :src="resultText" class="relative z-20" />
				</div>

				<button
					class="bg-secondary border-4 border-white absolute -bottom-8 left-1/2 -translate-x-1/2 text-white size-16 sm:size-20 text-xl sm:text-2xl rounded-full font-semibold cursor-pointer leading-none transition duration-500 delay-1000 opacity-0 z-50"
					:class="{ 'opacity-100': open }"
					@click="close"
				>
					OK
				</button>
			</div>
		</div>
	</div>

	<AuthModal
		:open="authModal"
		@close="
			authModal = false;
			close();
		"
	/>
</template>

<script setup>
const props = defineProps({
	open: Boolean,
	stepsStatus: {
		type: Array,
		required: true,
	},
	isRoulette: Boolean,
});

const emit = defineEmits(["close"]);
const router = useRouter();
const authModal = ref(false);

const getCircularStarStyle = (index, total) => {
	const skipAngle = 40;
	const visibleArc = 360 - skipAngle;
	const angleStep = visibleArc / (total - 1);

	const startAngle = -90 - visibleArc / 2;

	const angle = startAngle + angleStep * index;
	const radius = 152;
	const rad = (angle * Math.PI) / 180;

	const x = radius * Math.cos(rad);
	const y = radius * Math.sin(rad);

	return {
		left: `calc(50% + ${x}px)`,
		top: `calc(50% + ${y}px)`,
		transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
		"transform-origin": "center",
		position: "absolute",
	};
};

const getArcStarStyle = (index, total) => {
	const baseAngle = -90;
	const spread = 100;
	const step = spread / (total - 1);
	const angle = baseAngle - spread / 2 + index * step;

	const radius = 125;
	const rad = (angle * Math.PI) / 180;

	const x = radius * Math.cos(rad);
	const y = radius * Math.sin(rad);

	return {
		left: `calc(50% + ${x}px)`,
		top: `calc(50% + ${y}px)`,
		transform: `translate(-50%, -50%)`,
		position: "absolute",
	};
};

const resultText = computed(() => {
	const totalSteps = props.stepsStatus.length;
	const correctCount = computed(() => props.stepsStatus.filter(s => s === "correct").length);

	if (totalSteps === 4) {
		if (correctCount.value <= 2) return "/images/results/result-sorry.png";
		if (correctCount.value === 3) return "/images/results/result-welldone.png";
		return "/images/results/result-brilliant.png";
	} else if (totalSteps === 18) {
		if (correctCount.value <= 8) return "/images/results/result-sorry.png";
		if (correctCount.value <= 13) return "/images/results/result-welldone.png";
		return "/images/results/result-brilliant.png";
	}
	return "";
});

const stars = computed(() =>
	props.stepsStatus.map((status, index) => ({
		id: index,
		img: status === "correct" ? "/images/star-gold.png" : "/images/star-gray.png",
	}))
);

const close = () => {
	if (localStorage.getItem("auth_canceled")) {
		emit("close");
		if (props.isRoulette) {
			useRouletteStore().reset();
		} else {
			useSingleLessonStore().resetLesson();
		}
		router.push("/");
	} else {
		authModal.value = true;
	}
};
</script>

<style scoped>
.rotate-0 {
	transform: rotate(0deg);
}

.rotate-\[360deg\] {
	transform: rotate(360deg);
}
</style>
