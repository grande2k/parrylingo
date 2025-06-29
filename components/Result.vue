<template>
	<div
		class="fixed inset-0 bg-black/15 -z-1 flex items-center justify-center transition duration"
		:class="{ 'opacity-0': !open, 'opacity-100 z-50': open }"
	>
		<div
			class="bg-white rounded-full size-[300px] sm:size-[360px] text-center relative scale-90 opacity-0 transition duration drop-shadow-2xl"
			:class="{ 'scale-100 opacity-100': open }"
		>
			<img
				:src="resultImagePath"
				alt="Результат"
				class="mx-auto size-full object-cover scale-150 transition-transform duration-700"
				:class="{ 'rotate-0': open, 'rotate-[360deg]': !open }"
			/>

			<button
				class="bg-secondary border-4 border-white absolute -bottom-8 left-1/2 -translate-x-1/2 text-white size-16 sm:size-20 text-xl sm:text-2xl rounded-full font-semibold cursor-pointer leading-none transition duration-500 delay-1000 opacity-0"
				:class="{ 'opacity-100': open }"
				@click="close"
			>
				OK
			</button>
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

const resultImagePath = computed(() => {
	const correct = props.stepsStatus.filter(status => status === "correct").length;

	if (props.stepsStatus.length === 18) {
		const total = props.stepsStatus.length;
		const percent = (correct / total) * 100;

		let score = 1;
		if (percent >= 75) score = 4;
		else if (percent >= 50) score = 3;
		else if (percent >= 25) score = 2;

		return `/images/results/result${score}.png`;
	} else if (props.stepsStatus.length === 4) {
		return `/images/results/result${correct}.png`;
	} else {
		return "/images/results/result0.png";
	}
});

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
