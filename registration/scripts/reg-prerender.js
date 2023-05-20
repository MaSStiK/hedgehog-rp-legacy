import { getCache } from "../../assets/scripts/cache.js"
import { linkTo, disableButton, initInputPassword, initInputWithoutSpaces } from "../../assets/scripts/global-functions.js"
import { consts } from "../../assets/scripts/global-consts.js"
import { VKsendRequest, VKsendMessage } from "../../assets/scripts/vk-api.js"



// Нажатие на логотип переносит на главную
$(".logotype-wrapper img").on("click tap", () => { 
    linkTo("../home/")
})


// Переход на второй блок если бот находит сообщение
$("#first-page-button").on("click tap", () => {
    // Отключаем кнопку
    disableButton("#first-page-button")

    // Получаем всю сообщения бота
    // VKsendRequest('messages.getConversations', {extended: 1}, (data) => {
    VKsendRequest('messages.search', {q: "sdf51sd5fsd1f", extended: 1}, (data) => {
        // Сделать через поиск по сообщению

        data = data.response
        console.log(data);
        $("#first-page").addClass("hidden")
        $("#second-page").removeClass("hidden")
    })
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

// Объявляем инпуты без пробелов
initInputWithoutSpaces("#login")
initInputWithoutSpaces("#password")
initInputWithoutSpaces("#password-again")

// Заполняем плейсхолдеры
$("#login").attr("placeholder", `Логин (${consts.loginMin} - ${consts.loginMax} символа)`)
$("#password").attr("placeholder", `Пароль (${consts.passwordMin} - ${consts.passwordMax} символа)`)