import { VKtoken } from "./DOT-ENV"
import $ from "jquery";


// Получить ссылку на метод
function getMethodUrl(method, params, token) {
    params = params || {}
    params["access_token"] = VKtoken
    params["v"] = "5.131"
    return "https://api.vk.com/method/" + method + "?" + $.param(params)
}


// Отправить запрос
export function VKAPI(method, params, func=null, token=VKtoken) {
    $.ajax({
        url: getMethodUrl(method, params, token),
        method: "GET",
        dataType: "JSONP",
        success: func,
    })
}






// // Метод отправки сообщения
// export function VKsendMessage(peer_id, message, func=null) {
//     VKsendRequest("messages.send", {peer_id: peer_id, random_id: 0, message: message}, 
//         (data) => {
//             if (func) {
//                 func(data.response)
//             }
//         }
//     )
// }


//  Метод обработки ошибки
// export function VKsendError(text, error) {
//     // Если пользователя нажимает "Отмена", то не отправляем ошибку
//     if (!confirm(`${text}\nОтправить эту ошибку разработчику?\n${error}`)) {
//         relocate("../home/index.html")
//         return
//     }
    
//     let userData = getCache("userData")
//     let message = `Страница: ${location.href}`
//     if (userData) {
//         message += `\nОт: ${userData.name} (${userData.id})`
//     } else {
//         message += `\nОт: Anonymous`
//     }
//     message += `\nОшибка: ${error}`
//     message += `\nТекст: ${text}`

//     // Отправляем в беседу с ошибками, после перенаправляем на главную
//     VKsendMessage(2000000008, message, () => {
//         relocate("../home/index.html")
//     })
// }