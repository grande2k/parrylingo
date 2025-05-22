export default function getStaticUrl(path: string): string {
	const config = useRuntimeConfig();
	const base = config.public.mediaBaseUrl;

	if (!path) return "";
	return path.startsWith("http") ? path : `${base}${path}`;
}
