import $ from "jquery";

const GOOGLE_API = "https://script.google.com/macros/s/AKfycbz4zWCCVcZY_1OC7oPb2wG4NVBuhT6Md2SbLh42tmk5zPo8ZZqM7e1p-TlfSpPCt3Diwg/exec"

// Отправить запрос
export function GSAPI(action, data={}, func) {
    $.ajax({
        url: GOOGLE_API + "?action=" + action,
        method: "POST",
        crossDomain: true,
        // dataType: "JSONP", 
        data: data,
        success: data => func(JSON.parse(data)),
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