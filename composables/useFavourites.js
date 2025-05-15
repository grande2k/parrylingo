export const useFavourites = () => {
	const favourites = useState("favourite-lessons", () => []);

	const loadFavourites = () => {
		const saved = localStorage.getItem("favouriteLessons");
		favourites.value = saved ? JSON.parse(saved) : [];
	};

	const isFavourite = id => favourites.value.includes(id);

	const toggleFavourite = id => {
		const index = favourites.value.indexOf(id);
		if (index !== -1) {
			favourites.value.splice(index, 1);
		} else {
			favourites.value.push(id);
		}
		localStorage.setItem("favouriteLessons", JSON.stringify(favourites.value));
	};

	onMounted(loadFavourites);

	return { favourites, isFavourite, toggleFavourite };
};
