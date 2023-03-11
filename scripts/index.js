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

if (localStorage.getItem("errorSended")) {
    createNotification("Ошибка отправлена!", "primary")
    localStorage.removeItem("errorSended")
}

let scripts =  document.getElementsByTagName('script');
for(let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes("scripts-base.js")) {
        $(".update").text(scripts[i].src.split("scripts-base.js?")[1]);
    }
}

$(".userData").text(JSON.stringify(userData));



// try {
//     sendGSRequest("users", "getData", {}, (data) => {
//         try {
//             window.localStorage.setItem("allUsers", JSON.stringify(data))
//             if (authorized) { // Если авторизован то обновляем информацию о пользователе
//                 window.localStorage.setItem("userData", JSON.stringify(data[userData.id]))
//             }
        
//             // $(".userData").text(JSON.stringify(data[userData.id]))
//             $(".allUsers").text(JSON.stringify(data))
//         } catch (error) {
//             $(".error").text(error)
//         }
        
//     })
    
//     sendGSRequest("nations", "getData", {}, (data) => {
//         try {
//             // window.localStorage.setItem("allNations", JSON.stringify(data))
//             // allNations = data
//             $(".allNations").text(JSON.stringify(data))
//         } catch (error) {
//             $(".error").text(error)
//         }
        
//     })
// } catch (error) {
//     $(".error").text(error)
// }
