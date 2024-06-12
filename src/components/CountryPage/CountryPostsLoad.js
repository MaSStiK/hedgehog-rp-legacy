import { GSAPI } from "../API"
import { CONFIG } from "../Global"

// Загрузка постов страны
export function CountryPostsLoad(Context, offset, country_id) {
    return new Promise((resolve, reject) => {
        GSAPI("GETcountryPosts", {offset: offset, amount: CONFIG.POSTS_AMOUNT + 40, country_id: country_id}, (data) => {
            console.log(`GSAPI: GETcountryPosts {count: ${data.count}}`)

            // Сохраняем посты и получаем результат
            let countryPosts = CountryPostsSave(Context, data.posts)
            resolve(PostsObjectToArray(countryPosts[country_id]))
        })
    })
}


// Добавление и сохранение постов в контекст
export function CountryPostsSave(Context, postsObject) {
    let countryPosts = {...Context.countryPosts}
    postsObject.forEach(post => {
        if (post.country_id in countryPosts) { // Если такая страна уже есть в объекте - добавляем пост
            countryPosts[post.country_id][post.post_id] = post
        } else { // Если нету - создаем объект из id страны
            countryPosts[post.country_id] = {[post.post_id]: post}
        }
    })
    Context.setCountryPosts(countryPosts) // Сохраняем в посты страны в контексте
    return countryPosts // Возвращаем объект с постами, если он нужен
}


// Конвертация объекта с постами в массив постов
export function PostsObjectToArray(posts) {
    let postsArray = [] // Собираем массив с постами
    for (let post in posts) {
        postsArray.push(posts[post])
    }
    return postsArray.sort((a, b) => b.timestamp - a.timestamp) // Сортируем массив по timestamp
}