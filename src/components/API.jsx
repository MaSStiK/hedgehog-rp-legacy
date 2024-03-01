import { GoogleAPI, GoogleAPIdev, VkToken } from "./DOT-ENV"
import $ from "jquery";

// Отправить запрос
export function GSAPI(action, data={}, func) {
    $.ajax({
        crossDomain: true,
        url: GoogleAPI + "?action=" + action,
        method: "GET",
        dataType: "JSONP",
        data: data,
        success: func,
    })
}


// Получить ссылку на вк метод
function getMethodUrl(method, params, token) {
    params = params || {}
    params["access_token"] = "vk1.a." + token
    params["v"] = "5.131"
    return "https://api.vk.com/method/" + method + "?" + $.param(params)
}


// Отправить запрос
export function VKAPI(method, params, func=null, token=VkToken) {
    $.ajax({
        url: getMethodUrl(method, params, token),
        method: "GET",
        dataType: "JSONP",
        success: func,
    })
}