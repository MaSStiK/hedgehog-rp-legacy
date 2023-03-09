import {sendGSRequest} from "./scripts-base.js"

// window.localStorage.removeItem("userData")

// localStorage userData, allUsers
let userData = JSON.parse(window.localStorage.getItem("userData"))
let authorized = userData ? true : false

sendGSRequest("users", "getData", {}, (data) => {
    window.localStorage.setItem("allUsers", JSON.stringify(data))
    if (authorized) { // Если авторизован то обновляем информацию о пользователе
        window.localStorage.setItem("userData", JSON.stringify(data[userData.id]))
    }
})