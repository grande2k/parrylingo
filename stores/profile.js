export const useProfileStore = defineStore("profile", () => {
	const profile = ref(null);

	const fetchProfile = async () => {
		const access_token = useCookie("access_token").value;
		if (!access_token) return;

		const { data, error } = await useAPI("/user/profile");

		if (error.value) {
			console.error("Ошибка при загрузке профиля", error.value);
			return;
		}

		profile.value = data.value;
	};

	return { profile, fetchProfile };
});
