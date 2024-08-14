import { GSAPI } from "../API";
import { CONFIG } from "../Global"

export function formValidate(formName, formTag, formPhoto, formBio) {
    return new Promise((resolve, reject) => {
        // Проверка длины Названия
        if (formName.length < CONFIG.COUNTRY_NAME_MIN) return reject({text: `Название меньше ${CONFIG.COUNTRY_NAME_MIN} символов`, input: "title"})
        if (formName.length > CONFIG.COUNTRY_NAME_MAX) return reject({text: `Название больше ${CONFIG.COUNTRY_NAME_MAX} символов`, input: "title"})

        // Проверка длины тега
        if (formTag.length < CONFIG.COUNTRY_TAG_MIN) return reject({text: `Тег меньше ${CONFIG.COUNTRY_TAG_MIN} символов`, input: "tag"})
        if (formTag.length > CONFIG.COUNTRY_TAG_MAX) return reject({text: `Тег больше ${CONFIG.COUNTRY_TAG_MAX} символов`, input: "tag"})

        // Проверка наличия запрещенных символов
        const regex = /^[A-Za-z0-9_-]+$/; // Допускаем пробелы, подчеркивания и тире
        if (!regex.test(formTag)) return reject({text: `Тег содержит запрещенные символы`, input: "tag"})

        // Проверка длины фото
        if (formPhoto.length > CONFIG.PHOTO_LINK_MAX) return reject({text: `Ссылка на картинку больше ${CONFIG.PHOTO_LINK_MAX} символов`, input: "photo"})

        // Проверка длины описания
        if (formBio.length > CONFIG.COUNTRY_BIO_MAX) return reject({text: `Описание больше ${CONFIG.COUNTRY_BIO_MAX} символов`, input: "bio"})

        // Если прошло все проверки
        resolve()
    })
}

export function sendForm(Context, formName, formTag, formPhoto, formBio) {
    return new Promise((resolve, reject) => {
        // Новые данные о стране
        let newCountryData = {
            country_name    : formName, // Название страны
            country_tag     : "@" + formTag, // Тег страны
            country_photo   : formPhoto, // Флаг/картинка страны
            country_bio     : formBio, // Описание страны
        }

        // Всю главную информацию отправляем всегда
        GSAPI("PUTcountry", {token: Context.UserData.token, data: JSON.stringify(newCountryData)}, (data) => {
            console.log("GSAPI: PUTcountry");

            // Если ошибка
            if (!data.success || !Object.keys(data).length) {
                return reject(data.error)
            }

            // Сохранение информации локально
            let UserData = {...Context.UserData}
            UserData.country_id     = Context.UserData.country_id || "c" + Context.UserData.id
            UserData.country_name   = newCountryData.country_name
            UserData.country_tag    = newCountryData.country_tag
            UserData.country_photo  = newCountryData.country_photo
            UserData.country_bio    = newCountryData.country_bio
            localStorage.UserData = JSON.stringify(UserData) // В память браузера сохраняем строку
            Context.setUserData(UserData)

            // Удаляем старого юзера и сохраняем нового
            let users = Context.Users.filter(user => user.id !== Context.UserData.id)
            users.push(UserData)
            Context.setUsers(users)

            resolve()
        })
    })
}