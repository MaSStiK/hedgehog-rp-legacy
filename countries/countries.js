import {sendGSRequest, sendVkRequest, setInputError, createNotification, setButtonDisabled, logger, sendError} from "../global/scripts-base.js"
// localStorage.removeItem("userData")

// localStorage userData, userNations, userSelectedNation
let userData = JSON.parse(localStorage.getItem("userData"))
let authorized = userData ? true : false

// http://127.0.0.1:5500/countries.html?search=Олег%20петров
let urlParams = new URLSearchParams(location.search)
let params = {}
urlParams.forEach((e, key) => {
    params[key] = e
})

if (authorized) { // Если авторизован то добовляем кнопку "моя страна"
    $(".bottom__find").after(`<button class="primary-button bottom-button">Моя страна</button>`)
}

console.log(userData);

$(".bottom-button").on("click tap", () => {
    if (userData.about.сountry === "") {
        location.href = "../country-edit/index.html"
    } else {
        location.href = "../country/index.html"
    }
})