import { VKtoken } from "./DOT-ENV"
import $ from "jquery";


// Получить ссылку на метод
function getMethodUrl(method, params, token) {
    params = params || {}
    params["access_token"] = "vk1.a." + token
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