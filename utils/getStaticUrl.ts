export default function getStaticUrl(path: string): string {
	const config = useRuntimeConfig();
	const base = config.public.staticBaseUrl;

	if (!path) return "";
	return path.startsWith("http") ? path : `${base}${path}`;
}
