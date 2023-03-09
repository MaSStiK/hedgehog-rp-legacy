import {sendGSRequest} from "./scripts-base.js"

function ready () {
// window.localStorage.removeItem("strokaData")

// localStorage userData, allUsers, allNations
let userData = JSON.parse(window.localStorage.getItem("userData"))
let allUsers = JSON.parse(window.localStorage.getItem("allUsers"))
let allNations = JSON.parse(window.localStorage.getItem("allNations"))
let stroka = window.localStorage.getItem("strokaData")
let authorized = userData ? true : false

$(".error").text("WTF БЛЯТЬ")
// window.localStorage.setItem("counter", counter)
if (stroka) {
    $(".stroka").text("строка записана")
    window.localStorage.removeItem("strokaData")
} else {
    window.localStorage.setItem("strokaData", "любая запись")
}

}


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

document.addEventListener("DOMContentLoaded", ready());