export const useRouletteStore = defineStore("roulette", () => {
	const words = ref([]);
	const loading = ref(false);
	const current_step = ref(1);
	const stepsStatus = ref([]);
	const shuffledWords = ref([]);
	const audio = ref(null);

	const loadRoulette = async count => {
		loading.value = true;
		let endpoint;

		console.log(useRoute().query.source);

		if (useRoute().query.source === "favourites") {
			endpoint = `/favorites/lessons/roulette?count=${count}`;
		} else {
			endpoint = `/lessons/roulette?count=${count}`;
		}

		const { data, error } = await useAPI(endpoint);

		loading.value = false;

		if (error.value) {
			console.error("roulette fetch error");
			return;
		}

		words.value = data.value;
		stepsStatus.value = Array(count).fill(null);
		current_step.value = 1;
		const start_audio_url = getStaticUrl(words.value[0]?.audio);
		audio.value = new Audio(start_audio_url);
		shuffle();
	};

	const reset = () => {
		words.value = [];
		current_step.value = 1;
		stepsStatus.value = [];
		shuffledWords.value = [];
	};

	const shuffle = () => {
		if (!words.value.length) return;

		const current = words.value[(current_step.value - 1) % words.value.length];
		const other = words.value.filter(w => w.id !== current.id);

		let options = [current];
		if (other.length) {
			const randomWrong = other[Math.floor(Math.random() * other.length)];
			options.push(randomWrong);
		}

		shuffledWords.value = options.sort(() => Math.random() - 0.5);
	};

	const playAudio = async () => {
		const isSoundDisabled = localStorage.getItem("lesson_sound_disabled") === "true";

		if (isSoundDisabled) return;

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

	watch(current_step, newStep => {
		if (!words.value?.length) return;

		const word = words.value[newStep - 1];

		if (word?.audio) {
			audio.value.src = getStaticUrl(word.audio);
			audio.value.load();
			playAudio();
		}
	});

	return {
		words,
		loading,
		audio,
		current_step,
		stepsStatus,
		shuffledWords,
		loadRoulette,
		shuffle,
		playAudio,
		reset,
	};
});
