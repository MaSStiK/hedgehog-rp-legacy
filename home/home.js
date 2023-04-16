import {logger, sendError, createNotification, sendVkRequest, sendGSRequest} from "/global/scripts-base.js"

// localStorage.clear()

// localStorage userData, allUsers, allNations
let userData = JSON.parse(localStorage.getItem("userData"))

console.time("timer")
console.table(localStorage)

if (localStorage.getItem("afterAthorization")) { // Перезагрузка страницы с обновлением хеша после авторизации
    try {
        location.reload(true)
    } catch {}
    localStorage.removeItem("afterAthorization")
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
console.timeEnd("timer")