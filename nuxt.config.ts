import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["@pinia/nuxt", "@nuxtjs/i18n"],
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

	app: {
		head: {
			title: "ParryLingo",
			meta: [
				{
					name: "description",
					content:
						"ParryLingo offers the world's most AI-powered lessons to learn languages. It's really visual, fun and science-based. Practice online or on the app!",
				},
				{
					name: "keywords",
					content:
						"language,learning,английский,язык,learn,English,Spanish,French,Italien,German,Turk,apprendre, l’anglais,français,",
				},
			],
		},
	},
});
