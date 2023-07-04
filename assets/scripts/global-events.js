import { getCache, removeCache } from "./cache.js"
import { notify } from "./notification/notification.js"

// Интернет соединение восстановлено
$(window).on("online", (event) => {
    notify("Интернет соединение восстановлено", "primary")
})

// Потеряно интернет соединение
$(window).on("offline", (event) => {
    notify("Потеряно интернет соединение", "danger")
})


// Сообщение после регистрации
if (getCache("after-reg")) {
    removeCache("after-reg")
    notify("Вы успешно зарегистрировались!", "primary")
}

// Сообщение после входа
if (getCache("after-login")) {
    removeCache("after-login")
    notify("Вы успешно вошли в аккаунт!", "primary")
}

// Сообщение после ошибки изменения пароля
if (getCache("password-changed")) {
    removeCache("password-changed")
    notify("Пароль был изменен, требуется повторный вход!", "danger")
}