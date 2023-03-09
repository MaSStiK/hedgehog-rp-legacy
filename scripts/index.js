import {sendGSRequest} from "./scripts-base.js"

// window.localStorage.removeItem("userData")

// localStorage userData, allUsers, allNations
let userData = JSON.parse(window.localStorage.getItem("userData"))
let allUsers = JSON.parse(window.localStorage.getItem("allUsers"))
let allNations = JSON.parse(window.localStorage.getItem("allNations"))
let counter = window.localStorage.getItem("counter")
let authorized = userData ? true : false

$(".error").text("WTF БЛЯТЬ")
if (counter) {
    counter++
} else {
    counter = 0
}

window.localStorage.setItem("counter", counter)
$(".counter").text("counter: " + counter)

try {
    sendGSRequest("users", "getData", {}, (data) => {
        try {
            // window.localStorage.setItem("allUsers", JSON.stringify(data))
            // allUsers = data
            if (authorized) { // Если авторизован то обновляем информацию о пользователе
                // window.localStorage.setItem("userData", JSON.stringify(data[userData.id]))
                // userData = data[userData.id]
            }
        
            // $(".userData").text(JSON.stringify(data[userData.id]))
            $(".allUsers").text(JSON.stringify(data))
        } catch (error) {
            $(".error").text(error)
        }
        
    })
    
    sendGSRequest("nations", "getData", {}, (data) => {
        try {
            // window.localStorage.setItem("allNations", JSON.stringify(data))
            // allNations = data
            $(".allNations").text(JSON.stringify(data))
        } catch (error) {
            $(".error").text(error)
        }
        
    })
} catch (error) {
    $(".error").text(error)
}

