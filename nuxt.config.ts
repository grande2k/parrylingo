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
			title: "ParryLingo. Разговорный Английский язык для начинающих с нуля самостоятельно: за 100 уроков по 5 минут — до уровня B2",
			meta: [
				{
					name: "description",
					content: "Cоздавайте на каждый день комплект новых фразовых уроков с изображениями на основе LLM  ",
				},
				{
					name: "keywords",
					content:
						"английский язык, English, школа английского языка, английский онлайн, изучение английского, занятия английским, английский с преподавателем, французский, испанский, итальянский, немецкий, турецкий",
				},
			],
		},
	},
});
