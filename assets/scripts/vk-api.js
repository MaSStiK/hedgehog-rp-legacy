import { getCache } from "./cache.js"
import { relocate } from "./global-functions.js"

const idkWhatIsThis = "dmsxLmEuZy1HTFV2ZVpXdmRURS1haTJXbzBURGJ2SkVnNFJDclZwSHZxVklqTEVXOWtNeFdUM1dIY0FlMGFhdGFITUlFWGFLckp2YndSTW53U0JVVl9qWlBNRlk1Z21OVldzV2dPemU0ODUzUE92QjJHNk1BWGdJdWxCam5OTnlzMml2VjNCV2VlUzUzS1lnbVRWT0Rudm4xU1ZlQWRHWm5JYWM2OW1QX3dfX3dpWGFyT3hOdHY1OVFJS2xlcWtqNThRYWhFRjJrVjExOHl4QVdOYnlVVEcwcXVMZw=="

// Получить ссылку на метод
function getMethodUrl(method, params, token) {
    params = params || {}
    params['access_token'] = atob(token)
    params['v'] = "5.131"
    return "https://api.vk.com/method/" + method + "?" + $.param(params)
}


// Отправить запрос
export function VKsendRequest(method, params, func=null, token=idkWhatIsThis) {
    $.ajax({
        url: getMethodUrl(method, params, token),
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