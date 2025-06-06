export default defineNuxtPlugin(async nuxtApp => {
	const config = useRuntimeConfig();
	const i18n = nuxtApp.$i18n;

	const fallbackMessages = await import("../i18n/locales/en.json").then(m => m.default);

	const interfacesState = useState("interfaces", () => []);

	try {
		if (!interfacesState.value.length) {
			const res = await $fetch(`${config.public.apiBaseUrl}/admin/interface`);
			interfacesState.value = res;
		}

		for (const item of interfacesState.value) {
			const code = item.language_code;

			const cleanedMessages = Object.fromEntries(
				Object.entries(item.interface || {}).filter(([_, value]) => value?.trim())
			);

			const messages =
				code === "en"
					? { ...fallbackMessages, ...cleanedMessages }
					: { ...fallbackMessages, ...cleanedMessages };

			i18n.setLocaleMessage(code, messages);
		}

		if (process.client) {
			let savedLang = localStorage.getItem("interface_language");

			if (!savedLang) {
				const browserLang = navigator.language?.slice(0, 2) || "en";
				savedLang = browserLang;
				localStorage.setItem("interface_language", savedLang);
			}

			i18n.locale.value = savedLang;
		}
	} catch (error) {
		console.error("Ошибка загрузки интерфейса:", error);
	}
});
