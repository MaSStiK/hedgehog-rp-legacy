import { notify } from "./notification/notification.js"

// Интернет соединение восстановлено
$(window).on("online", (event) => {
    notify("Интернет соединение восстановлено", "primary")
})

// Потеряно интернет соединение
$(window).on("offline", (event) => {
    notify("Потеряно интернет соединение", "danger")
})



// Добавить уведомление после регистрации + уведомление от жалобы
