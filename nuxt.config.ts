import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["@pinia/nuxt", "@nuxtjs/i18n", "yandex-metrika-module-nuxt3"],
	css: ["~/assets/css/main.css"],
	colorMode: { preference: "light" },
	runtimeConfig: {
		public: { apiBaseUrl: process.env.API_BASE_URL, mediaBaseUrl: process.env.MEDIA_BASE_URL },
	},
	vite: {
		plugins: [tailwindcss()],
	},

	i18n: {
		defaultLocale: "en",
		lazy: true,
	},

	yandexMetrika: {
		id: process.env.YANDEX_METRIKA_ID,
		clickmap: true,
		trackLinks: true,
		accurateTrackBounce: true,
		webvisor: true,
	},
});
