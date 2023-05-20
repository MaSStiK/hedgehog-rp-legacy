import { getCache } from "../../assets/scripts/cache.js"
import { linkTo, initInputPassword, initInputWithoutSpaces } from "../../assets/scripts/global-functions.js"
import { consts } from "../../assets/scripts/global-consts.js"


// Нажатие на логотип переносит на главную
$(".logotype-wrapper img").on("click tap", () => { 
    linkTo("../home/")
})


// Ставим пределы для логина и пароля
$("#login").attr("minlength", consts.loginMin)
$("#login").attr("maxlength", consts.loginMax)

$("#password").attr("minlength", consts.passwordMin)
$("#password").attr("maxlength", consts.passwordMax)


// Объявляем запороленый инпут
initInputPassword("#password-input")

// Объявляем инпуты без пробелов
initInputWithoutSpaces("#login")
initInputWithoutSpaces("#password")


// Автозаполнение полей если есть юзердата
let userData = getCache("userData")
if (userData) {
    // $("#password").val()
    // $("#login").val()
}
