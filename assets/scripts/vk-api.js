import { getCache } from "./cache.js"
import { relocate } from "./global-functions.js"

const notAToken = "dmsxLmEuUGZEMzByTHY4SnBLMy1SQmprc2N6bVNoQlN5bWlaMGd4bFpuMkZpeEgtQjhPRy1NQV9HVlNCLWFPRmx2eWRyenp5QVlwUGZzNlE4X2ZSVVdKeGFwemp5SHBjdXpCeW5DMmJhWV9mVTBXa3pncUM1eUsxLXR2WTlmR0V0QmRuelpkT3ZGSTFFUGJzdDJYUHQteXlSNkp4VE43LVQ1MWJTYUloak56Y2pQcFdvMVhEN0RCaGRBYUpMQk4xbzBJMzZSMzFMME9SbEc0d3VMYzFpNHAySnBhdw"

// Получить ссылку на метод
function getMethodUrl(method, params) {
    params = params || {}
    params['access_token'] = atob(notAToken)
    params['v'] = "5.131"
    return "https://api.vk.com/method/" + method + "?" + $.param(params)
}


// Отправить запрос
export function VKsendRequest(method, params, func=null) {
    $.ajax({
        url: getMethodUrl(method, params),
        method: 'GET',
        dataType: 'JSONP',
        success: func,
    })
}


// Метод отправки сообщения
export function VKsendMessage(peer_id, message, func=null) {
    VKsendRequest('messages.send', {peer_id: peer_id, random_id: 0, message: message}, 
        (data) => {
            if (func) {
                func(data.response)
            }
        }
    )
}


// Метод обработки ошибки
export function VKsendError(text, error) {
    // Если пользователя нажимает "Отмена", то не отправляем ошибку
    if (!confirm(`${text}\nОтправить эту ошибку разработчику?\n${error}`)) {
        relocate("../home/index.html")
        return
    }
    
    let userData = getCache("userData")
    let message = `Страница: ${location.href}`
    if (userData) {
        message += `\nОт: ${userData.name} (${userData.id})`
    } else {
        message += `\nОт: Anonymous`
    }
    message += `\nОшибка: ${error}`
    message += `\nТекст: ${text}`

    // Отправляем в беседу с ошибками, после перенаправляем на главную
    VKsendMessage(2000000008, message, () => {
        relocate("../home/index.html")
    })
}


// 2000000001 Рп беседа
// 2000000002 test_chamber
// 2000000005 logs
// 2000000006 Географ Жалобы
// 2000000007 Географ Логи
// 2000000008 Географ Ошибки