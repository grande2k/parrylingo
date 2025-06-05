<template>
	<label class="switch">
		<input type="checkbox" v-model="enabled" @change="onToggle" />
		<span class="slider"></span>
	</label>
</template>

<script setup>
const props = defineProps({
	storageKey: {
		type: String,
		required: true,
	},
	defaultValue: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["update"]);

const enabled = ref(!props.defaultValue);

onMounted(() => {
	const saved = localStorage.getItem(props.storageKey);

	if (saved !== null) {
		enabled.value = saved === "false";
	} else {
		localStorage.setItem(props.storageKey, String(!props.defaultValue));
	}
});

const onToggle = () => {
	localStorage.setItem(props.storageKey, String(!enabled.value));
	emit("update", enabled.value);
};
</script>

<style scoped>
.switch {
	position: relative;
	display: inline-block;
	width: 42px;
	height: 22px;
}
.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}
.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	transition: 0.4s;
	border-radius: 22px;
}
.slider:before {
	position: absolute;
	content: "";
	height: 16px;
	width: 16px;
	left: 3px;
	bottom: 3px;
	background-color: white;
	transition: 0.4s;
	border-radius: 50%;
}
input:checked + .slider {
	background-color: #9bb27a;
}
input:checked + .slider:before {
	transform: translateX(20px);
}
</style>
