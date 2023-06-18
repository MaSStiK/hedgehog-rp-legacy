// Переход по ссылке
export function relocate(link) {
    location.href = link
}


// Скопировать текст
export function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
}


// Получить переменные из ссылки
export function getUrlParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search))
}


// Отключение кнопки на время
export function disableButton(id) {
    $(id).attr("disabled", "disabled")
    setTimeout(() => {$(id).removeAttr("disabled")}, 2000)
}


// Ошибка инпута
export function inputError(selector) {
    // Если у инпута нету класса ошибки - добавляем и через 2 секунды удаляем
    if (!$(selector).hasClass("error")) {
        $(selector).addClass("error")
        setTimeout(() => {$(selector).removeClass("error")}, 2000)
    }
}


// Инициализировать инпут с паролем (Только по специальной структуре)
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


// Инициализировать инпут без пробелов
export function initInputWithoutSpaces(selector) {
    const element = $(selector)
    // При вводе значения проверяеся нет ли пробела, если он есть, то заменяется на _
    element.on("input", () => {
        element.val(element.val().split(' ').join('_'))
    })
}


// Доабавить создание модального окна
