import $ from "jquery";

const test = "dmsxLmEud3VSZVhoUVptaG9NM3BxZTdHcFRORW4tR29lUlNwZDFVZThGZWlKRGs2eXJTaGJWRXBaX2NpYVc3am1pemFaOGQxQ2pOeFZzMnkyMTBZQmFacUtMY05tTDNkSFZBQllUZGhWQ2Nfc0F6cnY3amZlNnVCYk1WMS0wdHg5dUo1ZTA4SlpNNWtSNl9FZjc0TnJXME1wWGpJcWR2amtBeHlyV184bkxpaU51MkE1RUdlMkdUQWxFLVR6TVBBejd4Y0RNQW1fNDIycGh1WGt4SHEySHJTWVJKQQ=="

// Получить ссылку на метод
function getMethodUrl(method, params, token) {
    params = params || {}
    params["access_token"] = atob(token)
    params["v"] = "5.131"
    return "https://api.vk.com/method/" + method + "?" + $.param(params)
}


// Отправить запрос
export function VKAPI(method, params, func=null, token=test) {
    $.ajax({
        url: getMethodUrl(method, params, token),
        method: "GET",
        dataType: "JSONP",
        success: func,
    })
}


// 2000000001 Рп беседа
// 2000000002 test_chamber
// 2000000005 logs
// 2000000006 Географ Жалобы
// 2000000007 Географ Логи
// 2000000008 Географ Ошибки



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