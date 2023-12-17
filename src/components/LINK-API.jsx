import $ from "jquery";

export function LINKAPI(link, func) {
    $.ajax({
        crossDomain: true,
        url: "https://is.gd/create.php?format=json&url=" + encodeURIComponent(link),
        method: "GET",
        dataType: "JSONP",
        success: func,
    })
}