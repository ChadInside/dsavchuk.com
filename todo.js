//todo error handling in controllers and services

//todo add/remove from favourite (push/pull from redux user.favourite  based on api response)

// TODO отдельная страница пользователей
//  информация о пользователе,

// рецепты: возможность добавлять картинки с прилагаемыми небольшими комментариями
// еще одно текстовое поле по уточнениям (к ингридиентам, ...), поле по вариациям в рецепте


//   todo unify getting recipes from DB and populating and formatting ingredients data
//     recipe DTO

// cleanup client

// todo creating new recipe check for empty ingredients & tags


//Known bugs:
// creating new recipe -> client sends all tags/ings with "id"s, but when updating send existing tags/ings with "id"s and not existing with "_id"s
// solved on server with mapping "_id"s to "id"