import $ from "jquery";

export function LINKAPI(link, func) {
    $.ajax({
        crossDomain: true,
        url: "https://clck.ru/--?url=" + encodeURIComponent(link),
        method: "GET",
        dataType: "TEXT",
        success: func,
    })
}