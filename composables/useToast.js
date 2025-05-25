import { createApp, h, ref, nextTick } from "vue";
import Toast from "~/components/Toast.vue";

export const useToast = () => {
	const showToast = (message, duration = 2000) => {
		const container = document.createElement("div");
		document.body.appendChild(container);

		const visible = ref(true);

		const app = createApp({
			setup() {
				const close = () => {
					visible.value = false;
					setTimeout(() => {
						app.unmount();
						container.remove();
					}, 300);
				};

				return () =>
					h(Toast, {
						message,
						duration,
						visible: visible.value,
						onClose: close,
					});
			},
		});

		app.mount(container);
	};

	return { showToast };
};
