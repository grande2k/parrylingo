<template>
	<div ref="container" class="multi-select w-40 sm:w-60">
		<div class="multi-select__trigger" @click="toggleDropdown">
			<span>{{ label }}</span>

			<span class="arrow">
				<IconArrowDown />
			</span>
		</div>

		<div v-if="isOpen" class="multi-select__dropdown">
			<label v-if="defaultAll" class="option">
				<input type="checkbox" :checked="isAllSelected" @change="toggleOption(null)" />
				<span class="checkmark"></span>
				<span>{{ $t("all") }}</span>
			</label>

			<label v-for="option in props.options" :key="option.value" class="option">
				<input type="checkbox" :checked="selected === option.value" @change="toggleOption(option.value)" />
				<span class="checkmark"></span>
				<span>{{ option.label }}</span>
			</label>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	options: {
		type: Array,
		required: true,
	},
	modelValue: {
		type: [String, null],
		default: null,
	},
	defaultAll: Boolean,
});

const { t } = useI18n();

const emit = defineEmits(["update:modelValue"]);

const container = ref(null);
const isOpen = ref(false);
const selected = ref(null);

const isAllSelected = computed(() => props.defaultAll && selected.value === null);

const label = computed(() => {
	if (isAllSelected.value) return t("all");
	if (selected.value) return props.options.find(o => o.value === selected.value).label;
	return t("select");
});

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
};

const toggleOption = value => {
	selected.value = value;
	isOpen.value = false;
};

const onClickOutside = e => {
	if (container.value && !container.value.contains(e.target)) {
		isOpen.value = false;
	}
};

watch(
	() => props.modelValue,
	val => {
		const isEqual = JSON.stringify(val) === JSON.stringify(selected.value);
		if (!isEqual) {
			if (!val.length) {
				selected.value = props.options.map(o => o.value);
			} else {
				selected.value = [...val];
			}
		}
	}
);

watch(selected, val => {
	emit("update:modelValue", val);
});

onMounted(() => {
	document.addEventListener("mousedown", onClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener("mousedown", onClickOutside);
});
</script>

<style scoped>
.multi-select {
	position: relative;
	font-family: sans-serif;
	user-select: none;
}

.multi-select__trigger {
	border: 1px solid #ccc;
	padding: 6px 12px;
	border-radius: 6px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #fff;
	font-size: 14px;
	color: var(--gray-500);
	user-select: none;
}

.multi-select__trigger span {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.multi-select__dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	z-index: 50;
	background: white;
	border: 1px solid #ddd;
	border-radius: 6px;
	width: 100%;
	margin-top: 4px;
	max-height: 200px;
	overflow-y: auto;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	padding: 8px;
}

.option {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 6px;
	cursor: pointer;
	position: relative;
	user-select: none;
}

.arrow {
	font-size: 10px;
}

.option input {
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}

.option .checkmark {
	position: relative;
	height: 16px;
	width: 16px;
	background-color: transparent;
	border-radius: 50%;
	border: 2px solid var(--color-black);
}

.option .checkmark:after {
	content: "";
	position: absolute;
	display: none;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 10px;
	height: 10px;
	border-radius: 50%;
}

.option:hover input + .checkmark {
	background-color: #ccc;
}

.option input:checked + .checkmark:after {
	display: block;
	background-color: var(--color-secondary);
}
</style>
