// Переход по ссылке
export function linkTo(link) {
    location.href = link
}


// Ошибка инпута
export function inputError(selector) {
    // Если у инпута нету класса ошибки - добавляем и через 2 секунды удаляем
    if (!$(selector).hasClass("error")) {
        $(selector).addClass("error")
        setTimeout(() => {$(selector).removeClass("error")}, 2000)
    }
}


// Инициализировать инпут с паролем
export function initInputPassword(selector) {
    const input = $(selector + " input")
    const button = $(selector + " button")
    const img = $(selector + " button img")

    button.on("click tap", () => {
        // По нажатию проверка, если инпут внутри с типом "Пароль", то меняется картинка и тип на "Текст"
        if (input.attr("type") === "password") {
            img.attr("src", "../assets/images/icons/EyeClosed.svg")
            input.attr("type", "text")
            return
        }

        // Если тип "Текст", то возвращаем пароль и иконку открытого глаза
        img.attr("src", "../assets/images/icons/EyeOpen.svg")
        input.attr("type", "password")
    })
}


// Отключение кнопки на время
export function disableButton(id) {
    $(id).attr("disabled", "disabled")
    setTimeout(() => {$(id).removeAttr("disabled")}, 2000)
}


// Доабвить создание модального окна
