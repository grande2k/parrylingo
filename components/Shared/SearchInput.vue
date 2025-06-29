<template>
	<div class="relative w-full max-w-56 sm:max-w-64">
		<input
			type="text"
			:value="localValue"
			@input="onInput"
			placeholder="Seach..."
			class="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
		/>

		<button type="button" class="absolute inset-y-0 right-0 flex items-center px-3" @click="handleIconClick">
			<template v-if="localValue">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-4 text-error-500 cursor-pointer"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</template>

			<template v-else>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-4 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
					/>
				</svg>
			</template>
		</button>
	</div>
</template>

<script setup>
const model = defineModel({ default: "" });
const localValue = ref(model.value);

function useDebounce(fn, delay = 300) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	};
}

const emitChange = useDebounce(value => {
	model.value = value;
}, 300);

const onInput = e => {
	localValue.value = e.target.value;
	emitChange(localValue.value);
};

const handleIconClick = () => {
	if (localValue.value) {
		localValue.value = "";
		emitChange("");
	}
};
</script>
