import { GSAPI, VKAPI } from "../API"
import { CONSTS } from "../Global"

export default function AuthViaToken(Context, token) {
    return new Promise((resolve, reject) => {
        // Если токен пустой
        if (!token) {
            return reject("Вы не ввели токен")
        }

        // Проверка длины токена
        if (token.length > CONSTS.loginTokenMax) {
            return reject(`Код больше ${CONSTS.loginTokenMax} символов`)
        }

        GSAPI("AuthViaToken", {token: token}, (data) => {
            // Если не нашло по токену
            if (!data.success || !Object.keys(data).length) {
                return reject("Токен не действителен")
            }

            // Если успех - сохраняем и открываем главную
            let newUserData = data.data
            newUserData.token = token // Ставим токен
            localStorage.userData = JSON.stringify(newUserData)

            Context.setUserData(newUserData)

            // Отправляем сообщение пользователю
            VKAPI("messages.send", {peer_id: parseInt(newUserData.vk_id), random_id: 0, message: "Вы успешно вошли в свой аккаунт по токену!"})
            resolve()
        })
    })
}