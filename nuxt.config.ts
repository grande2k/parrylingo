import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	site: {
		url: "https://parrylingo.com",
		title: "Parrylingo",
	},

	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["@pinia/nuxt", "@nuxtjs/i18n", "yandex-metrika-module-nuxt3", "@nuxtjs/robots", "@nuxtjs/sitemap"],
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

	sitemap: {
		autoI18n: false,
		sources: ["/api/urls"],
	},

	yandexMetrika: {
		id: process.env.YANDEX_METRIKA_ID,
		clickmap: true,
		trackLinks: true,
		accurateTrackBounce: true,
		webvisor: true,
	},
});
