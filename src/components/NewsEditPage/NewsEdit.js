import { GSAPI } from "../API";
import { CONFIG } from "../Global"

export function formValidate(formTitle, formText, attachments) {
    return new Promise((resolve, reject) => {
        // Проверка длины Названия
        if (formTitle.length < CONFIG.POST_TITLE_MIN) {
            return reject({text: `Заголовок меньше ${CONFIG.POST_TITLE_MIN} символов`, input: "title"})
        }

        if (formTitle.length > CONFIG.POST_TITLE_MAX) {
            return reject({text: `Заголовок больше ${CONFIG.POST_TITLE_MAX} символов`, input: "title"})
        }


        // Проверка длины Текста
        if (formText.length > CONFIG.POST_TEXT_MAX) {
            return reject({text: `Текст больше ${CONFIG.POST_TEXT_MAX} символов`, input: "text"})
        }


        // Проверка кол-во фото
        if (attachments.length > CONFIG.POST_ATTACH_MAX) {
            return reject({text: `Картинок больше ${CONFIG.POST_ATTACH_MAX}`, input: "photo"})
        }

        // Если прошло все проверки
        resolve()
    })
}

export function sendForm(Context, post, formTitle, formText, attachments) {
    return new Promise((resolve, reject) => {
        // Пользователь может поменять поля post_title, post_text, attachments

        // Данные нового поста
        const newPostData = {
            country_id  : post.country_id, // id страны
            post_id     : post.post_id, // id поста
            post_title  : formTitle, // Заголовок поста
            post_text   : formText, // Текст поста
            attachments : JSON.stringify(Array.from(attachments, (attach) => attach.url)), // Прикрепленные картинки
            season      : post.season, // Текущий сезон
            timestamp   : post.timestamp // Дата создания поста
        }

        GSAPI("PUTpost", {data: JSON.stringify(newPostData), token: Context.UserData.token}, (data) => {
            console.log("GSAPI: PUTpost");

            // Если ошибка
            if (!data.success || !Object.keys(data).length) {
                return reject(data.error)
            }

            let posts = [...Context.Posts]
            const postIndex = posts.findIndex(_post => _post.post_id === post.post_id) // Находим пост по его id
            if (postIndex >= 0) { // Если пост найден - заменяем его и сохраняем
                posts[postIndex] = newPostData // Заменяем пост на новую версию
                Context.setPosts(posts)
            }

            // Изменяем пост в объект постов стран
            let countryPosts = {...Context.CountryPosts}
            countryPosts[newPostData.country_id][post.post_id] = newPostData
            Context.setCountryPosts(countryPosts) // Сохраняем в посты страны в контексте

            resolve()
        })
    })
}