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
            let userData = data.data
            userData.token = token // Ставим токен
            localStorage.UserData = JSON.stringify(userData)
            Context.setUserData(userData)
            localStorage.PageSettings = JSON.stringify(userData.settings) // Сохраняем настройки в память браузера
            Context.setPageSettings(userData.settings) // Сохраняем настройки

            // Отправляем сообщение пользователю
            VKAPI("messages.send", {peer_id: Number(userData.vk_id), random_id: 0, message: "Вы успешно вошли в свой аккаунт по токену!"})
            resolve()
        })
    })
}