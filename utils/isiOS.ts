export const isiOS = () => {
	if (process.server) return false;

	return /iPad|iPhone|iPod/.test(navigator.userAgent);
};
