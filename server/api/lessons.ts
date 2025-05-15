export default defineEventHandler(event => {
	return [
		{
			id: "lesson_uuid_1",
			author: { id: "author_uuid", first_name: "Anna", last_name: "White" },
			language: { id: "lang_uuid_1", name: "English" },
			words: [
				{
					id: "word_uuid_1",
					title: "Apple",
					image: "https://freshleafuae.com/wp-content/uploads/2024/08/red-apple-freshleaf-dubai-uae-img01-600x600.jpg",
					audio: "https://sounds.com/apple",
				},
				{
					id: "word_uuid_2",
					title: "Banana",
					image: "https://img.freepik.com/free-photo/single-banana-isolated-white-background_839833-17794.jpg",
					audio: "https://sounds.com/banana",
				},
			],
		},
		{
			id: "lesson_uuid_2",
			author: { id: "author_uuid", first_name: "John", last_name: "Doe" },
			language: { id: "lang_uuid_1", name: "English" },
			words: [
				{
					id: "word_uuid_3",
					title: "Pineapple",
					image: "https://freshleafuae.com/wp-content/uploads/2024/08/red-apple-freshleaf-dubai-uae-img01-600x600.jpg",
					audio: "https://sounds.com/apple",
				},
				{
					id: "word_uuid_4",
					title: "Cherry",
					image: "https://img.freepik.com/free-photo/single-banana-isolated-white-background_839833-17794.jpg",
					audio: "https://sounds.com/banana",
				},
			],
		},
	];
});
