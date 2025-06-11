export function getTitleForLang(
	titles: Record<string, string>,
	languageCode: string,
	with_fallback: boolean
): string | null {
	if (!titles || !languageCode) return null;

	if (titles[languageCode]) return titles[languageCode];

	const fallback = Object.entries(titles).find(([key]) => key.startsWith(`${languageCode}_`));
	if (fallback) return fallback[1];

	if (with_fallback) return titles["en_us"] || titles["ru"] || Object.values(titles)[0] || null;
	else return null;
}
