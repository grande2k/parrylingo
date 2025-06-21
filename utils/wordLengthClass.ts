export default function wordLengthClass(text: string, extraSmall: boolean | null | undefined) {
	const wordCount = text?.trim()?.split(" ").length || 1;

	if (wordCount >= 5) return "text-xs";
	if (wordCount >= 4) return extraSmall ? "text-xs" : "text-sm";
	if (wordCount >= 2) return extraSmall ? "text-sm" : "text-base";

	return extraSmall ? "text-lg" : "text-xl";
}
