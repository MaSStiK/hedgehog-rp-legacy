import $ from "jquery";

const idkWhatIsThis = "dmsxLmEuZUNtcTRRaWt4RXM4TjZwVGpReEtZZFpEdDhTVEZqckNiaHlSWE16LVVPckFTUUxBUzhQck5JU0dQMWRZRHB5NHFPd1dhUXB0clkteVU4eXdZNTRXRDkzY3ZmdXRIbkpQQ0x3RG0yRmRTWUJFeUx1dkphQ3d2ajVjdnJ2WUl6eFFZdUZYVlFpSVI0VmxtQ0lYQTVRZGxpYnBnVEswS1ViVDU4d29JRVU4Y1R0OWNkU3VfZXp6TG9JczJhX2xhQm9Sc1RfRXVOYXhna25ZT2RoOWVLNzd6UQ=="

// Получить ссылку на метод
function getMethodUrl(method, params, token) {
    params = params || {}
    params["access_token"] = atob(token)
    params["v"] = "5.131"
    return "https://api.vk.com/method/" + method + "?" + $.param(params)
}


// Отправить запрос
export function VKAPI(method, params, func=null, token=idkWhatIsThis) {
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