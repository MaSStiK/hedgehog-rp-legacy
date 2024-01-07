import { GoogleAPI, GoogleAPIdev } from "./DOT-ENV"
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