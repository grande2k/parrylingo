import type { UseFetchOptions } from "#app";
import { toRaw, isReactive } from "vue";

export async function useAPI<T>(endpoint: string | (() => string), options?: UseFetchOptions<T>) {
	const baseUrl = useRuntimeConfig().public.apiBaseUrl;
	const api = await useNuxtApp().$api;

	const finalUrl = typeof endpoint === "function" ? endpoint() : endpoint;
	const fullUrl = `${baseUrl.replace(/\/$/, "")}/${finalUrl.replace(/^\//, "")}`;

	if (options?.body && isReactive(options.body)) {
		options.body = structuredClone(toRaw(options.body));
	}

	return useFetch(fullUrl, {
		...options,
		server: false,
		$fetch: api as typeof $fetch,
	});
}
