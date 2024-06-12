import { GSAPI } from "../API";
import { CONFIG } from "../Global"

export function formValidate(formName, formTag, formPhoto, formBio) {
    return new Promise((resolve, reject) => {
        // Проверка длины Названия
        if (formName.length < CONFIG.USER_NAME_MIN) {
            return reject({text: `Название меньше ${CONFIG.USER_NAME_MIN} символов`, input: "name"})
        }

        if (formName.length > CONFIG.USER_NAME_MAX) {
            return reject({text: `Название больше ${CONFIG.USER_NAME_MAX} символов`, input: "name"})
        }


        // Проверка длины тега
        if (formTag.length > CONFIG.USER_TAG_MAX) {
            return reject({text: `Тег больше ${CONFIG.USER_TAG_MAX} символов`, input: "tag"})
        }

        // Проверка наличия запрещенных символов
        const regex = /^[A-Za-z0-9_-]+$/; // Допускаем пробелы, подчеркивания и тире
        if (!regex.test(formTag)) {
            return reject({text: `Тег содержит запрещенные символы`, input: "tag"})
        }


        // Проверка длины фото
        if (formPhoto.length > CONFIG.PHOTO_LINK_MAX) {
            return reject({text: `Ссылка на картинку больше ${CONFIG.PHOTO_LINK_MAX} символов`, input: "photo"})
        }
        

        // Проверка длины описания
        if (formBio.length > CONFIG.USER_BIO_MAX) {
            return reject({text: `Описание больше ${CONFIG.USER_BIO_MAX} символов`, input: "bio"})
        }

        // Если прошло все проверки
        resolve()
    })
}

export function sendForm(Context, formName, formTag, formPhoto, formBio) {
    return new Promise((resolve, reject) => {
        // Новые данные о стране
        let newUserData = {
            name    : formName, // Название страны
            tag     : "@" + formTag, // Тег страны
            bio     : formBio, // Описание страны
            photo   : formPhoto, // Флаг/картинка страны
        }

        // Всю главную информацию отправляем всегда
        GSAPI("PUTuser", {token: Context.userData.token, data: JSON.stringify(newUserData)}, (data) => {
            console.log("GSAPI: PUTuser");

            // Если ошибка
            if (!data.success || !Object.keys(data).length) {
                return reject(data.error)
            }

            // Сохранение информации локально
            let userData    = {...Context.userData}
            userData.name   = newUserData.name
            userData.tag    = newUserData.tag
            userData.photo  = newUserData.photo
            userData.bio    = newUserData.bio
            localStorage.userData = JSON.stringify(userData) // В память браузера сохраняем строку
            Context.setUserData(userData)

            // Удаляем старого юзера и сохраняем нового
            let usersWithoutUser = Context.users.filter((user) => {return user.id !== Context.userData.id})
            usersWithoutUser.push(userData)
            Context.setUsers(usersWithoutUser)

            resolve()
        })
    })
}