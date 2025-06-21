<template>
	<div class="relative border-4 border-gray-400 rounded-2xl p-4 sm:p-6 pb-4 sm:pb-8">
		<div class="flex items-center gap-4 mb-4">
			<PuzzleMask empty class="size-24 sm:size-36 mx-auto select-none" />

			<span class="text-black text-4xl sm:text-6xl select-none">+</span>

			<PuzzleMask direction="right" empty class="size-24 sm:size-36 mx-auto select-none" />
		</div>

		<div
			ref="draggable"
			class="relative bg-secondary border-6 border-white rounded-full tracking-wide leading-tight text-white text-center py-3 px-8 font-bold mx-auto touch-none select-none"
			:class="[
				wordLengthClass(getTitleForLang(currentWord.titles, rouletteStore.language.language_code, true)),
				{ 'cursor-grab': !dragDisabled },
			]"
			:style="
				dragging
					? {
							position: 'fixed',
							top: `${position.y}px`,
							left: `${position.x}px`,
							transform: 'translate(-50%, -50%)',
							zIndex: 50,
					  }
					: {
							position: 'absolute',
							left: '50%',
							bottom: '-2rem',
							transform: 'translateX(-50%)',
					  }
			"
			@mousedown="startDrag"
			@touchstart="startDrag"
		>
			{{ getTitleForLang(currentWord.titles, rouletteStore.language.language_code, true) }}
		</div>

		<button
			class="absolute right-5 sm:right-8 -bottom-5 sm:-bottom-7 size-10 sm:size-14 flex items-center justify-center border-4 border-white rounded-full text-white select-none"
			:class="isLessonSoundDisabled ? 'bg-gray-400' : 'bg-secondary cursor-pointer'"
			@click="handlePlay"
		>
			<IconSound class="size-4 sm:size-6" />
		</button>

		<button
			class="absolute -right-5 sm:-right-7 -bottom-5 sm:-bottom-7 size-10 sm:size-14 flex items-center justify-center border-4 border-white rounded-full text-white text-lg sm:text-2xl select-none cursor-pointer"
			:class="tooltipsDisabled ? 'bg-gray-400' : 'bg-secondary'"
			@click="toggleTooltips"
		>
			?
		</button>
	</div>

	<div class="grid grid-cols-2 gap-4 mt-8 sm:mt-10">
		<button
			v-for="word in rouletteStore.shuffledWords"
			:key="word.id"
			@click="selectAnswer(word)"
			:disabled="isAnswerProcessing"
			:class="['btn-answer relative', selectedWordId === word.id ? 'zoom' : '', getBorderClass(word.id)]"
		>
			<img :src="getStaticUrl(word.image)" class="size-32 sm:size-42 object-contain select-none" alt="" />

			<p
				v-if="!tooltipsDisabled && getTitleForLang(word.titles, i18n.locale.value)"
				class="absolute -bottom-6 sm:-bottom-7 left-1/2 -translate-x-1/2 bg-gray-400 border-4 border-white text-white leading-tight font-medium min-w-32 sm:min-w-36 py-1 sm:py-2 px-4 sm:px-4 rounded-full flex items-center justify-center"
				:class="wordLengthClass(getTitleForLang(word.titles, i18n.locale.value), true)"
			>
				{{ getTitleForLang(word.titles, i18n.locale.value) }}
			</p>
		</button>
	</div>

	<Result
		:open="showResultModal"
		:stepsStatus="rouletteStore.stepsStatus"
		isRoulette
		@close="showResultModal = false"
	/>
</template>

<script setup>
const rouletteStore = useRouletteStore();
const selectedWordId = ref(null);
const answerStatus = ref(null);
const showResultModal = ref(false);
const isAnswerProcessing = ref(false);

const correctAudio = new Audio("/audio/answer_correct.mp3");
const incorrectAudio = new Audio("/audio/answer_incorrect.mp3");
const resultAudio = new Audio("/audio/result.mp3");

const total = computed(() => rouletteStore.stepsStatus.length);

const currentWord = computed(() => {
	return rouletteStore.words[(rouletteStore.current_step - 1) % rouletteStore.words.length];
});

const isLessonSoundDisabled = useState("lessonSoundDisabled");
const tooltipsDisabled = ref(false);

const i18n = useI18n();

const toggleTooltips = () => {
	tooltipsDisabled.value = !tooltipsDisabled.value;
	localStorage.setItem("tooltips_disabled", tooltipsDisabled.value);
};

const selectAnswer = answer => {
	if (isAnswerProcessing.value) return;
	isAnswerProcessing.value = true;
	selectedWordId.value = answer.id;

	const lang_code = rouletteStore.language.language_code;

	setTimeout(() => {
		const isCorrect =
			getTitleForLang(answer.titles, lang_code) === getTitleForLang(currentWord.value.titles, lang_code);
		answerStatus.value = isCorrect ? "correct" : "wrong";

		const isSoundDisabled = localStorage.getItem("interface_sound_disabled") === "true";

		if (!isSoundDisabled) {
			const audio = isCorrect ? correctAudio : incorrectAudio;
			audio.pause();
			audio.currentTime = 0;
			audio.play();
		}

		setTimeout(() => {
			rouletteStore.stepsStatus[rouletteStore.current_step - 1] = answerStatus.value;
			selectedWordId.value = null;
			answerStatus.value = null;

			setTimeout(() => {
				if (rouletteStore.current_step >= total.value) {
					showResultModal.value = true;
					if (!isSoundDisabled) resultAudio.play();
				} else {
					rouletteStore.current_step += 1;
					rouletteStore.shuffle();
				}
				isAnswerProcessing.value = false;
				stopDragging();
			}, 200);
		}, 400);
	}, 200);
};

const handlePlay = () => {
	const isSoundDisabled = localStorage.getItem("lesson_sound_disabled") === "true";
	if (!isSoundDisabled) rouletteStore.playAudio();
};

const draggable = ref(null);
const dragging = ref(false);
const dragDisabled = ref(false);
const position = reactive({ x: 0, y: 0 });

const getTouchOrMouseEvent = e => {
	if (e.touches && e.touches[0]) return e.touches[0];
	if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0];
	return e;
};

const startDrag = e => {
	if (e.target.tagName.toLowerCase() === "button" || e.target.closest("button")) return;
	if (dragDisabled.value) return;

	const event = getTouchOrMouseEvent(e);
	dragging.value = true;

	position.x = event.clientX;
	position.y = event.clientY;

	document.addEventListener("mousemove", onDrag);
	document.addEventListener("mouseup", endDrag);
	document.addEventListener("touchmove", onDrag);
	document.addEventListener("touchend", endDrag);
};

const onDrag = e => {
	if (!dragging.value || dragDisabled.value) return;
	const event = getTouchOrMouseEvent(e);

	position.x = event.clientX;
	position.y = event.clientY;
};

const endDrag = e => {
	if (!dragging.value) return;

	const event = getTouchOrMouseEvent(e);
	const dropX = event.clientX;
	const dropY = event.clientY;

	const buttons = document.querySelectorAll(".btn-answer");
	let droppedOnAnswer = false;

	for (const btn of buttons) {
		const rect = btn.getBoundingClientRect();
		if (dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom) {
			const img = btn.querySelector("img");
			const word = rouletteStore.shuffledWords.find(w => getStaticUrl(w.image) === img?.getAttribute("src"));
			if (word) {
				selectAnswer(word);
				droppedOnAnswer = true;
				break;
			}
		}
	}

	dragDisabled.value = true;

	if (!droppedOnAnswer) stopDragging();
};

const stopDragging = () => {
	dragging.value = false;
	dragDisabled.value = false;
	document.removeEventListener("mousemove", onDrag);
	document.removeEventListener("mouseup", endDrag);
	document.removeEventListener("touchmove", onDrag);
	document.removeEventListener("touchend", endDrag);
};

const getBorderClass = wordId => {
	if (selectedWordId.value !== wordId) return "btn-border-default";

	if (answerStatus.value === "correct") return "btn-border-correct";
	if (answerStatus.value === "wrong") return "btn-border-wrong";

	return "btn-border-default";
};

onMounted(() => {
	tooltipsDisabled.value = localStorage.getItem("tooltips_disabled") === "true";
});
</script>
