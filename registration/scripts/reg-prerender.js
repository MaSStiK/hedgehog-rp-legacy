import { getCache } from "../../assets/scripts/cache.js"
import { linkTo, disableButton, initInputPassword, initInputWithoutSpaces } from "../../assets/scripts/global-functions.js"
import { notify } from "../../assets/scripts/notification/notification.js"
import { consts } from "../../assets/scripts/global-consts.js"


// Ставим пределы для логина, пароля и повтора пароля
$("#login").attr("minlength", consts.loginMin)
$("#login").attr("maxlength", consts.loginMax)

$("#password").attr("minlength", consts.passwordMin)
$("#password").attr("maxlength", consts.passwordMax)

$("#password-again").attr("minlength", consts.passwordMin)
$("#password-again").attr("maxlength", consts.passwordMax)

// Заполняем плейсхолдеры
$("#login").attr("placeholder", `Логин (${consts.loginMin} - ${consts.loginMax} символа)`)
$("#password").attr("placeholder", `Пароль (${consts.passwordMin} - ${consts.passwordMax} символа)`)


// Объявляем запороленый инпут
initInputPassword("#password-input")
initInputPassword("#password-again-input")

// Объявляем инпуты без пробелов
initInputWithoutSpaces("#login")
initInputWithoutSpaces("#password")
initInputWithoutSpaces("#password-again")


// Нажатие на логотип переносит на главную
$(".logotype-wrapper img").on("click tap", () => { 
    linkTo("../home/")
})


// Работу вторго блока с кнопками да/нет описал в основном скрипте


// Возвращение на второй блок
$("#last-page-back").on("click tap", () => {
    $("#last-page").addClass("hidden")
    $("#second-page").removeClass("hidden")
})


// Копирование ключа (Значение берется из тега с ключем только значение самого ключа)
$("#copy-vkcode").on("click tap", () => {
    navigator.clipboard.writeText($("#vkcode").text().split(" ")[1])
    notify("Код скопирован!", "primary")
})