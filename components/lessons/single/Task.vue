<template>
	<div class="relative border-4 border-gray-400 rounded-2xl p-4 sm:p-6 pb-6 sm:pb-8">
		<div class="flex items-center gap-4 mb-4">
			<PuzzleMask
				:imageUrl="getStaticUrl(currentWord.image)"
				:empty="singleLessonStore.current_step > 2"
				class="size-24 sm:size-36 mx-auto select-none"
			/>

			<span class="text-black text-4xl sm:text-6xl select-none">+</span>

			<PuzzleMask
				direction="right"
				:imageUrl="getStaticUrl(currentWord.image)"
				:empty="singleLessonStore.current_step > 2"
				class="size-24 sm:size-36 mx-auto select-none"
			/>
		</div>

		<div
			ref="draggable"
			class="relative bg-secondary border-6 border-white rounded-full tracking-wide leading-tight text-white text-center py-3 px-8 font-bold mx-auto touch-none select-none"
			:class="[
				wordLengthClass(
					getTitleForLang(currentWord.titles, singleLessonStore.lesson.language.language_code, true)
				),
				{ 'cursor-grab': !dragDisabled },
				{ 'text-[0px] size-16 !py-2 !px-2': isWordVisibilityDisabled },
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
			{{ getTitleForLang(currentWord.titles, singleLessonStore.lesson.language.language_code, true) }}
		</div>

		<button
			class="absolute -right-5 sm:-right-7 bottom-5 sm:bottom-8 size-10 sm:size-14 flex items-center justify-center border-4 border-white rounded-full text-white select-none cursor-pointer"
			:class="isWordVisibilityDisabled ? 'bg-gray-400' : 'bg-secondary'"
			:disabled="animateHint"
			@click="toggleWordVisibility"
		>
			<IconPencil class="size-4 sm:size-6" />
		</button>

		<button
			class="absolute right-5 sm:right-8 -bottom-5 sm:-bottom-7 size-10 sm:size-14 flex items-center justify-center border-4 border-white rounded-full text-white select-none"
			:class="isLessonSoundDisabled ? 'bg-gray-400' : 'bg-secondary cursor-pointer'"
			:disabled="animateHint"
			@click="handlePlay"
		>
			<IconSound class="size-4 sm:size-6" />
		</button>

		<button
			class="absolute -right-5 sm:-right-7 -bottom-5 sm:-bottom-7 size-10 sm:size-14 flex items-center justify-center border-4 border-white rounded-full text-white text-lg sm:text-2xl select-none cursor-pointer"
			:class="tooltipsDisabled ? 'bg-gray-400' : 'bg-secondary'"
			:disabled="animateHint"
			@click="toggleTooltips"
		>
			?
		</button>
	</div>

	<div class="grid grid-cols-2 gap-4 mt-8 sm:mt-10">
		<button
			v-for="word in singleLessonStore.shuffledWords"
			:key="word.id"
			@click="selectAnswer(word)"
			:disabled="isAnswerProcessing || animateHint"
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

	<Transition name="fade">
		<div
			v-if="hintReady && correctWord"
			class="pointer-events-none fixed z-50"
			:style="{
				top: animateHint ? `${targetRect.y}px` : `${startRect.y}px`,
				left: animateHint ? `${targetRect.x}px` : `${startRect.x}px`,
				transform: 'translate(-50%, -50%)',
				transition: 'top 1s ease, left 1s ease',
			}"
			@transitionend="handleHintReached"
		>
			<img
				src="/images/finger.png"
				class="size-24 sm:size-32 object-contain transition-transform duration-300"
				:class="{ 'scale-90': animateHintZoom }"
				alt="hint"
			/>
		</div>
	</Transition>

	<Result :open="showResultModal" :stepsStatus="singleLessonStore.stepsStatus" @close="showResultModal = false" />
</template>

<script setup>
const props = defineProps({
	showStart: {
		type: Boolean,
		default: false,
	},
});

const singleLessonStore = useSingleLessonStore();

const selectedWordId = ref(null);
const answerStatus = ref(null);
const showResultModal = ref(false);
const isAnswerProcessing = ref(false);

const correctAudio = new Audio("/audio/answer_correct.mp3");
const incorrectAudio = new Audio("/audio/answer_incorrect.mp3");
const resultAudio = new Audio("/audio/result.mp3");

const isLessonSoundDisabled = useState("lessonSoundDisabled");
const isWordVisibilityDisabled = useState("wordVisibilityDisabled");
const tooltipsDisabled = ref(false);

const i18n = useI18n();

const toggleTooltips = () => {
	tooltipsDisabled.value = !tooltipsDisabled.value;
	localStorage.setItem("tooltips_disabled", tooltipsDisabled.value);
};

const toggleWordVisibility = () => {
	isWordVisibilityDisabled.value = !isWordVisibilityDisabled.value;
	localStorage.setItem("word_visibility_disabled", isWordVisibilityDisabled.value);
};

const currentWord = computed(() => {
	if (singleLessonStore.current_step % 2) {
		return singleLessonStore.lesson.words[0];
	} else {
		return singleLessonStore.lesson.words[1];
	}
});

const selectAnswer = answer => {
	if (isAnswerProcessing.value) return;
	isAnswerProcessing.value = true;
	selectedWordId.value = answer.id;

	const lang_code = singleLessonStore.lesson.language.language_code;

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
			singleLessonStore.stepsStatus[singleLessonStore.current_step - 1] = answerStatus.value;
			selectedWordId.value = null;
			answerStatus.value = null;

			setTimeout(async () => {
				if (singleLessonStore.current_step === 4) {
					showResultModal.value = true;
					if (!isSoundDisabled) resultAudio.play();
					const token = useCookie("access_token");
					if (token.value) {
						const correctCount = singleLessonStore.stepsStatus.filter(s => s === "correct").length;
						const { error } = await useAPI("/progress/lessons", {
							method: "POST",
							body: { lesson_id: singleLessonStore.lesson.id, stars: correctCount },
						});

						if (error.value) return;

						useProfileStore().fetchProfile();
					}
				} else {
					singleLessonStore.current_step += 1;
					singleLessonStore.shuffleWords();
				}
				isAnswerProcessing.value = false;
				stopDragging();
			}, 200);
		}, 400);
	}, 200);
};

const handlePlay = () => {
	const isSoundDisabled = localStorage.getItem("lesson_sound_disabled") === "true";
	if (!isSoundDisabled) singleLessonStore.playAudio();
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
	if (animateHint.value) return;
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
			const word = singleLessonStore.shuffledWords.find(w => getStaticUrl(w.image) === img?.getAttribute("src"));
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

const showHint = ref(false);
const animateHint = ref(false);
const animateHintZoom = ref(false);

const correctWord = computed(() => {
	const lang = singleLessonStore.lesson.language.language_code;
	return singleLessonStore.shuffledWords.find(
		w => getTitleForLang(w.titles, lang) === getTitleForLang(currentWord.value.titles, lang)
	);
});

const startRect = reactive({ x: 0, y: 0 });
const targetRect = reactive({ x: 0, y: 0 });

const hintReady = computed(() => {
	return showHint.value && startRect.x !== 0 && startRect.y !== 0;
});

onMounted(() => {
	tooltipsDisabled.value = localStorage.getItem("tooltips_disabled") === "true";
});

watch(
	() => props.showStart,
	isShown => {
		if (!isShown) {
			if (!localStorage.getItem("hint_shown")) {
				showHint.value = true;

				nextTick(() => {
					const wordEl = draggable.value;
					const answerBtns = document.querySelectorAll(".btn-answer");

					if (!wordEl || !correctWord.value) return;

					const wordBox = wordEl.getBoundingClientRect();
					console.log(wordBox);
					const correctBtn = Array.from(answerBtns).find(btn => {
						const img = btn.querySelector("img");
						return img?.getAttribute("src") === getStaticUrl(correctWord.value.image);
					});

					if (correctBtn) {
						const targetBox = correctBtn.getBoundingClientRect();

						startRect.x = wordBox.left + wordBox.width / 2;
						startRect.y = wordBox.top + wordBox.height / 2;

						targetRect.x = targetBox.left + targetBox.width / 2;
						targetRect.y = targetBox.top + targetBox.height / 2;
					}

					console.log(targetRect);

					setTimeout(() => {
						animateHint.value = true;

						setTimeout(() => {
							selectAnswer(correctWord.value);
							animateHintZoom.value = true;

							setTimeout(() => {
								showHint.value = false;
								animateHint.value = false;
								animateHintZoom.value = false;
								localStorage.setItem("hint_shown", "true");
							}, 700);
						}, 1500);
					}, 500);
				});
			}
		}
	}
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s linear;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
