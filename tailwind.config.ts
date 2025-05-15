import { type Config } from "tailwindcss";

const config: Config = {
	content: [
		"./components/**/*.{vue,js,ts}",
		"./modules/**/*.{vue,js,ts}",
		"./pages/**/*.{vue,js,ts}",
		"./layouts/**/*.{vue,js,ts}",
		"./app.vue",
	],
	theme: {
		extend: {
			colors: {
				black: "#000",
				white: "#fff",

				primary: "#fd6a29",
				secondary: "#9bb27a",

				"bg-color": "#fffefb",
				"dark-gray": "#898a8d",

				gray: {
					25: "#fcfcfd",
					50: "#f9fafb",
					100: "#f2f4f7",
					200: "#eaecef",
					300: "#d0d5dd",
					400: "#98a2b3",
					500: "#667085",
					600: "#475467",
					700: "#344054",
					800: "#1d2939",
					900: "#101828",
				},

				error: {
					100: "#ffe8e7",
					200: "#fecdca",
					500: "#f04438",
				},

				warning: {
					100: "#fef0c7",
					500: "#f79009",
				},

				success: {
					100: "#d7ffe7",
					200: "#abefc6",
					500: "#17b26a",
				},
			},

			fontFamily: {
				sans: ['"Poppins"', "sans-serif"],
			},

			fontSize: {
				base: "16px",
			},
		},
	},
	plugins: [],
};

export default config;
