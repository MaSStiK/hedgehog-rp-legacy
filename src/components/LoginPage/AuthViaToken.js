import { GSAPI, VKAPI } from "../API"
import { CONFIG } from "../Global"

export default function AuthViaToken(Context, token) {
    return new Promise((resolve, reject) => {
        // Если токен пустой
        if (!token) return reject("Вы не ввели токен")

        // Проверка длины токена
        if (token.length > CONFIG.AUTH_TOKEN_MAX) return reject(`Токен больше ${CONFIG.AUTH_TOKEN_MAX} символов`)

        GSAPI("AuthViaToken", {token: token}, (data) => {
            // Если не нашло по токену
            if (!data.success || !Object.keys(data).length) return reject("Токен не действителен")

            // Если успех - сохраняем и открываем главную
            document.cookie = `auth_token=${token}; path=/; max-age=31104000; SameSite=Strict` // Сохраняем токен
            let UserData = data.data
            UserData.token = token // Ставим токен
            localStorage.UserData = JSON.stringify(UserData)
            Context.setUserData(UserData)
            localStorage.PageSettings = JSON.stringify(UserData.settings) // Сохраняем настройки в память браузера
            Context.setPageSettings(UserData.settings) // Сохраняем настройки

            // Отправляем сообщение пользователю
            VKAPI("messages.send", {peer_id: Number(UserData.vk_id), random_id: 0, message: "Вы успешно вошли в свой аккаунт по токену!"})
            // Отправляем сообщение в Авторизации
            VKAPI("messages.send", {peer_id: 2000000007, random_id: 0, message: `Авторизация пользователя по токену:\n${UserData.name}\nhttps://vk.com/id${UserData.id}`})
            resolve()
        })
    })
}