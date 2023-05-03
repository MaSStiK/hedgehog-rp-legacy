import {sendGSRequest, sendVkRequest, setInputError, createNotification, setButtonDisabled, logger, sendError} from "../global/scripts-base.js"
// localStorage.removeItem("userData")

// localStorage userData, userNations, userSelectedNation
let userData = JSON.parse(localStorage.getItem("userData"))
let authorized = userData ? true : false

// http://127.0.0.1:5500/country.html?id=12341234
let urlParams = new URLSearchParams(location.search)
let params = {}
urlParams.forEach((e, key) => {
    params[key] = e
})

if (authorized) {

}

$(".info-images__logo-fullscreen").on("click tap", () => { // Открать логотип фулскрин
    $(".logo-opened").css("display", "flex")
})

$(".logo-opened__close").on("click tap", () => { // Закрыть логотип
    $(".logo-opened").css("display", "none")
})

$(".info-images__map-fullscreen").on("click tap", () => { // Открать карту фулскрин
    $(".map-opened").css("display", "flex")
})

$(".map-opened__close").on("click tap", () => { // Закрыть карту
    $(".map-opened").css("display", "none")
})
