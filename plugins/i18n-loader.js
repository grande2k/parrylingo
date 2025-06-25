export default defineNuxtPlugin(async nuxtApp => {
	const config = useRuntimeConfig();
	const i18n = nuxtApp.$i18n;

	const fallbackMessages = await import("../i18n/locales/en.json").then(m => m.default);
	const interfacesState = useState("interfaces", () => []);

	if (!interfacesState.value.length) {
		try {
			const res = await $fetch(`${config.public.apiBaseUrl}/admin/interface`);
			interfacesState.value = res;
		} catch (error) {
			console.error("Ошибка загрузки интерфейса:", error);
		}
	}

	for (const item of interfacesState.value) {
		const code = item.language_code;

		const cleanedMessages = Object.fromEntries(
			Object.entries(item.interface || {}).filter(([_, value]) => value?.trim())
		);

		const messages = { ...fallbackMessages, ...cleanedMessages };
		i18n.setLocaleMessage(code, messages);
	}

	let resolvedLang = "en";

	if (process.server) {
		const headers = useRequestHeaders();
		const acceptLang = headers["accept-language"]?.slice(0, 2);
		const supportedLangs = interfacesState.value.map(i => i.language_code);

		if (acceptLang && supportedLangs.includes(acceptLang)) {
			resolvedLang = acceptLang;
		}
	} else if (process.client) {
		const savedLang = localStorage.getItem("interface_language");
		if (savedLang) {
			resolvedLang = savedLang;
		} else {
			const browserLang = navigator.language?.slice(0, 2) || "en";
			resolvedLang = browserLang;
			localStorage.setItem("interface_language", resolvedLang);
		}
	}

	i18n.locale.value = resolvedLang;
});
