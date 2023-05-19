import { getCache } from "../../assets/scripts/cache.js"
import { linkTo, initInputPassword } from "../../assets/scripts/global-functions.js"
import { consts } from "../../assets/scripts/global-consts.js"


// Нажатие на логотип переносит на главную
$(".logotype-wrapper img").on("click tap", () => { 
    linkTo("../home/")
})


// Переход на второй блок
$("#first-page-button").on("click tap", () => {
    $("#first-page").addClass("hidden")
    $("#second-page").removeClass("hidden")
})

// Переход на финальный блок
$("#second-page-yes").on("click tap", () => {
    $("#second-page").addClass("hidden")
    $("#last-page").removeClass("hidden")
})

// Возвращение на первый блок
$("#second-page-no").on("click tap", () => {
    $("#second-page").addClass("hidden")
    $("#first-page").removeClass("hidden")
})

// Возвращение на второй блок
$("#last-page-back").on("click tap", () => {
    $("#last-page").addClass("hidden")
    $("#second-page").removeClass("hidden")
})


// Объявляем запороленый инпут
initInputPassword("#password-input")
initInputPassword("#password-again-input")

// Заполняем плейсхолдеры
$("#login").attr("placeholder", `Логин (${consts.loginMin} - ${consts.loginMax} символа)`)
$("#password").attr("placeholder", `Пароль (${consts.passwordMin} - ${consts.passwordMax} символа)`)