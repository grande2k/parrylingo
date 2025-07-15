export const useFavourites = () => {
	const favourites = useState("favourite-lessons", () => []);

	const loadFavourites = async () => {
		const isAuthenticated = useCookie("access_token").value;

		if (isAuthenticated) {
			const { data, error } = await useAPI("/favorites/lessons");

			if (error.value) {
				console.error("Ошибка при загрузке избранных лекций", error.value);
				return;
			} else {
				favourites.value = data.value.map(l => l.id);
			}
		} else {
			const saved = localStorage.getItem("favouriteLessons");
			favourites.value = saved ? JSON.parse(saved) : [];
		}
	};

	const isFavourite = id => favourites.value.includes(id);

	const toggleFavourite = async id => {
		const isAuthenticated = useCookie("access_token").value;

		if (isAuthenticated) {
			if (isFavourite(id)) {
				const { error } = await useAPI(`/favorites/lessons/${id}`, {
					method: "DELETE",
				});

				if (error.value) {
					console.error("Ошибка при удалении избранного лекции", error.value);
					return;
				} else {
					favourites.value = favourites.value.filter(l => l !== id);
				}
			} else {
				const { data, error } = await useAPI("/favorites/lessons", {
					method: "POST",
					query: { lesson_id: id },
				});

				if (error.value) {
					console.error("Ошибка при добавлении лекции в избранное", error.value);
					return;
				} else {
					favourites.value.push(id);
				}
			}
		} else {
			const index = favourites.value.indexOf(id);
			if (index !== -1) {
				favourites.value.splice(index, 1);
			} else {
				favourites.value.push(id);
			}

			localStorage.setItem("favouriteLessons", JSON.stringify(favourites.value));
		}
	};

	onMounted(loadFavourites);

	return { favourites, isFavourite, toggleFavourite };
};
