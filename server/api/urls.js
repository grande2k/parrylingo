export default defineSitemapEventHandler(async () => {
	try {
		const response = await $fetch("https://api.parrylingo.com/api/v1/lessons?page=1&size=100");

		const sitemapUrls = response?.items?.map(item => ({
			loc: `/${item.id}`,
		}));

		return sitemapUrls;
	} catch (error) {
		console.log(error);
		return [];
	}
});
