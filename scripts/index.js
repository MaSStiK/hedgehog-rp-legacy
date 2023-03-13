import {logger, sendError, createNotification, sendVkRequest, sendGSRequest} from "./scripts-base.js"

// localStorage.clear()

// localStorage userData, allUsers, allNations
let userData = JSON.parse(localStorage.getItem("userData"))

if (localStorage.getItem("afterAthorization")) { // Перезагрузка страницы с обновлением хеша после авторизации
    try {
        location.reload(true)
    } catch {}
    localStorage.removeItem("afterAthorization")
}

if (localStorage.getItem("passwordChangedAfter")) { // И уведомляем пользователя
    createNotification("Пароль был изменен, или не найден локально!", "danger")
    localStorage.removeItem("passwordChangedAfter")
}

if (localStorage.getItem("passwordChanged")) { // После изменение пароля на другом устройсвте выкенет на гланую
    localStorage.clear()
    localStorage.removeItem("passwordChanged")
    localStorage.setItem("passwordChangedAfter", "passwordChangedAfter") 
    try {
        location.reload(true) // Удаляем данные и хеш
    } catch {}
}

if (localStorage.getItem("errorSended")) { // После отправки ошибки
    createNotification("Ошибка отправлена!", "primary")
    localStorage.removeItem("errorSended")
}

/////////////////////////////////////////////////////////////
let scripts =  document.getElementsByTagName('script');
for(let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes("scripts-base.js")) {
        $(".update").text(scripts[i].src.split("scripts-base.js?")[1]);
    }
}

$(".userData").text(JSON.stringify(userData));
