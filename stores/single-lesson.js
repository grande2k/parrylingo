import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
// import { getStaticUrl } from "@/utils/getStaticUrl";

export const useSingleLessonStore = defineStore("single-lesson", () => {
	const lesson = ref(null);
	const loading = ref(true);
	const current_step = ref(1);
	const audio = ref(null);
	const stepsStatus = ref([null, null, null, null]);
	const shuffledWords = ref([]);

	const route = useRoute();

	const fetchSingleLesson = async () => {
		await nextTick();

		loading.value = true;

		const lesson_id = route.params.lesson_id;
		const { data, error } = await useAPI(`/lesson/${lesson_id}`);

		loading.value = false;

		if (error.value) {
			console.error("Error fetching single lesson");
		} else {
			lesson.value = data.value || null;
			const start_audio_url = getStaticUrl(lesson.value?.words?.[0]?.audio);
			audio.value = new Audio(start_audio_url);
			if (lesson.value?.words?.length) shuffleWords();
		}
	};

	const playAudio = async () => {
		try {
			if (!audio.value || !audio.value.src) {
				console.warn("Audio is not ready to play");
				return;
			}

			await audio.value.play();
		} catch (err) {
			console.error("Error playing audio:", err);
		}
	};

	const shuffleWords = () => {
		if (!lesson.value?.words?.length) return;
		shuffledWords.value = [...lesson.value.words].sort(() => Math.random() - 0.5);
	};

	const resetLesson = () => {
		lesson.value = null;
		current_step.value = 1;
		stepsStatus.value = [null, null, null, null];
		shuffledWords.value = [];
	};

	watch(current_step, newStep => {
		if (!lesson.value?.words?.length) return;

		const wordIndex = newStep % 2 === 1 ? 0 : 1;
		const word = lesson.value.words[wordIndex];

		if (word?.audio) {
			audio.value.src = getStaticUrl(word.audio);
			audio.value.load();
			playAudio();
		}
	});

	return {
		lesson,
		loading,
		audio,
		playAudio,
		current_step,
		stepsStatus,
		fetchSingleLesson,
		shuffledWords,
		shuffleWords,
		resetLesson,
	};
});
