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

export function sendForm(Context, formTitle, formText, attachments, publicationDate, publisher_id) {
    return new Promise((resolve, reject) => {
        // Дата создания
        let dateNow = Date.now()

        let country_id = Context.UserData.country_id
        if (publisher_id) { // Если передаем id публикующего - берем его id
            country_id = "c" + publisher_id
        }

        // Данные нового поста
        const newPostData = {
            country_id  : country_id, // id страны
            post_id     : country_id + "_" + dateNow, // id поста (Он не зависит от даты публикации, он всегда привязан ко времени)
            post_title  : formTitle, // Заголовок поста
            post_text   : formText, // Текст поста
            attachments : JSON.stringify(Array.from(attachments, (attach) => attach.url)), // Прикрепленные картинки
            season      : "4", // Текущий сезон
            timestamp   : publicationDate // Дата создания поста
        }

        GSAPI("POSTpost", {data: JSON.stringify(newPostData), token: Context.UserData.token}, (data) => {
            console.log("GSAPI: POSTpost");

            // Если ошибка
            if (!data.success || !Object.keys(data).length) {
                return reject(data.error)
            }

            let posts = [...Context.Posts]
            posts.unshift(newPostData) // Вставляем новый пост в начало всех постов
            Context.setPosts(posts)

            // Добавляем пост в объект постов стран
            let countryPosts = {...Context.CountryPosts}
            if (newPostData.country_id in countryPosts) { // Если такая страна уже есть в объекте - добавляем пост
                countryPosts[newPostData.country_id][newPostData.post_id] = newPostData
            } else { // Если нету - создаем объект из id страны
                countryPosts[newPostData.country_id] = {[newPostData.post_id]: newPostData}
            }
            Context.setCountryPosts(countryPosts) // Сохраняем в посты страны в контексте

            resolve()
        })
    })
}