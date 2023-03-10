import {sendVkRequest, sendGSRequest} from "./scripts-base.js"

localStorage.clear()

// localStorage userData, allUsers, allNations
// let userData = JSON.parse(window.localStorage.getItem("userData"))
// let allUsers = JSON.parse(window.localStorage.getItem("allUsers"))
// let allNations = JSON.parse(window.localStorage.getItem("allNations"))
// let authorized = userData ? true : false

if (window) {
    $(".userData").text("window");
} else {
    $(".userData").text("null");
}
$(".allUsers").text(JSON.stringify(localStorage));
if (localStorage) {
    $(".allUsers").text(JSON.stringify(localStorage));
} else {
    $(".allUsers").text("null local");
}

localStorage.setItem("lolka", "lolka")
$(".stroka").text("lolka");

sendVkRequest('messages.send', {peer_id: 2000000007, random_id: 0, message: "auth"}, 
    (data) => {
        if (data.response) { // success
            createNotification("Жалоба отправлена!", "primary")
            $(".edit-modal__wrapper").css("display", "none")
        }

        if (data.error) { // error
            alert(`Не удалось отправить жалобу!\nОтправьте эту ошибку разработчику https://vk.com/291195777\n${data.error.error_msg}`)
        }
    }
)

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
