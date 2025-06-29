export default defineNuxtPlugin(nuxtApp => {
	const config = useRuntimeConfig();

	const api = $fetch.create({
		baseURL: config.public.apiBaseUrl,
		onRequest({ request, options }) {
			const accessToken = useCookie("access_token");

			if (accessToken) {
				options.headers.set("Authorization", `${accessToken.value}`);
			}
		},

		onResponse({ response }) {
			// Можно логировать или обрабатывать глобально
		},

		async onResponseError({ request, options, response }) {
			if (response.status === 401) {
				const refreshToken = useCookie("refresh_token");
				const accessToken = useCookie("access_token");

				if (refreshToken.value) {
					try {
						const refreshed = await $fetch("/login/refresh", {
							method: "POST",
							baseURL: config.public.apiBaseUrl,
							headers: {
								Authorization: `${refreshToken.value}`,
							},
						});

						accessToken.value = refreshed.access_token;

						return await $fetch.raw(request, {
							...options,
							headers: {
								...options.headers,
								Authorization: `${refreshed.access_token}`,
							},
						});
					} catch (refreshError) {
						accessToken.value = null;
						refreshToken.value = null;
						console.error("Не удалось обновить токен:", refreshError);
					}
				}
			}

			throw response;
		},
	});

	nuxtApp.provide("api", api);
});
