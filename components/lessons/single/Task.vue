<template>
	<div class="relative border-4 border-gray-400 rounded-2xl p-6 pb-8">
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
			class="relative bg-secondary border-6 border-white rounded-full text-xl sm:text-2xl tracking-wide text-white text-center py-4 pl-8 pr-20 font-bold mx-auto touch-none select-none"
			:class="{ 'cursor-grab': !dragDisabled }"
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
							bottom: '-2.5rem',
							transform: 'translateX(-50%)',
					  }
			"
			@mousedown="startDrag"
			@touchstart="startDrag"
		>
			{{ currentWord.title }}

			<button
				class="absolute right-0 top-0 size-15 sm:size-16 flex items-center justify-center border-4 border-white rounded-full text-white select-none"
				:class="
					isSoundDisabled ? 'bg-gray-400' : 'bg-secondary transition hover:bg-secondary/75 cursor-pointer'
				"
				@click="handlePlay"
			>
				<IconSound />
			</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4 mt-10">
		<button
			v-for="word in singleLessonStore.shuffledWords"
			:key="word.id"
			@click="selectAnswer(word)"
			:disabled="isAnswerProcessing"
			:class="['btn-answer', selectedWordId === word.id ? 'zoom' : '', getBorderClass(word.id)]"
		>
			<img :src="getStaticUrl(word.image)" class="size-32 sm:size-42 object-contain select-none" alt="" />
		</button>
	</div>

	<Result :open="showResultModal" :stepsStatus="singleLessonStore.stepsStatus" @close="showResultModal = false" />
</template>

<script setup>
const emit = defineEmits(["play-muted"]);

defineProps({
	isSoundDisabled: Boolean,
});

const singleLessonStore = useSingleLessonStore();

const selectedWordId = ref(null);
const answerStatus = ref(null);
const showResultModal = ref(false);
const isAnswerProcessing = ref(false);

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

	setTimeout(() => {
		const isCorrect = answer.title === currentWord.value.title;
		answerStatus.value = isCorrect ? "correct" : "wrong";

		setTimeout(() => {
			singleLessonStore.stepsStatus[singleLessonStore.current_step - 1] = answerStatus.value;
			selectedWordId.value = null;
			answerStatus.value = null;

			setTimeout(() => {
				if (singleLessonStore.current_step === 4) {
					showResultModal.value = true;
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

	if (isSoundDisabled) {
		emit("play-muted");
	} else {
		singleLessonStore.playAudio();
	}
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
</script>
