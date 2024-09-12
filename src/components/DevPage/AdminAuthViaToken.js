import { GSAPI } from "../API"
import { CONFIG } from "../Global"

export default function AdminAuthViaToken(Context, token) {
    return new Promise((resolve, reject) => {
        // Если токен пустой
        if (!token) return reject("Вы не ввели токен")

        // Проверка длины токена
        if (token.length > CONFIG.AUTH_TOKEN_MAX) return reject(`Токен больше ${CONFIG.AUTH_TOKEN_MAX} символов`)

        GSAPI("AuthViaToken", {token: token}, (data) => {
            // Если не нашло по токену
            if (!data.success || !Object.keys(data).length) return reject("Токен не действителен")

            // Если успех - сохраняем и открываем главную
            let newUserData = data.data
            newUserData.token = token // Ставим токен
            localStorage.UserData = JSON.stringify(newUserData)
            document.cookie = `auth_token=${token}; path=/; max-age=31104000; SameSite=Strict`
            Context.setUserData(newUserData)
            
            resolve()
        })
    })
}