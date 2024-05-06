import $ from "jquery";

const GOOGLE_API = "https://script.google.com/macros/s/AKfycby0ajEKJKjRzOIYqPIgnKW8nl2v2er66Tcmz8dVMe1ENdIoj_kFff3gYH2-KAm7y-jp4Q/exec"

// Отправить запрос
export function GSAPI(action, data={}, func) {
    $.ajax({
        crossDomain: true,
        url: GOOGLE_API + "?action=" + action,
        method: "GET",
        dataType: "JSONP",
        data: data,
        success: func,
    })
}


// Получить ссылку на вк метод
function getMethodUrl(method, params, token) {
    params = params || {}
    params["access_token"] = token
    params["v"] = "5.131"
    return "https://api.vk.com/method/" + method + "?" + $.param(params)
}


// Отправить запрос
export function VKAPI(method, params={}, func=null, token=process.env.REACT_APP_VK_TOKEN) {
    $.ajax({
        url: getMethodUrl(method, params, token),
        method: "GET",
        dataType: "JSONP",
        success: func,
    })
}