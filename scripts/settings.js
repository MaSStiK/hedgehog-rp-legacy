import {sendGSRequest, sendVkRequest, setButtonDisabled, setInputError} from "./scripts-base.js"

// localStorage.removeItem("userData")

// localStorage userData, allUsers
let userData = JSON.parse(localStorage.getItem("userData"))
let authorized = userData ? true : false

if (!authorized) {
    alert("Эта страница доступна только авторизованным пользователям!")
    location.href = "./index.html"
}

// $(".password-block__content-text").text(`Ваш текущий пароль: ${userData.password[0]}********${userData.password.slice(-1)}`)

$(".old-password__img").on("click tap", () => { // Показать/спрятать старый пароль
    if ($(".old-password__img").hasClass("show-password")) {
        $(".old-password__img").removeClass("show-password")
        $(".old-password__img").attr("src", "./assets/EyeOpen.svg")
        $(".old-password").attr("type", "password")
    } else {
        $(".old-password__img").addClass("show-password")
        $(".old-password__img").attr("src", "./assets/EyeClosed.svg")
        $(".old-password").attr("type", "text")
    }
})

$(".new-password__img").on("click tap", () => { // Показать/спрятать новый пароль
    if ($(".new-password__img").hasClass("show-password")) {
        $(".new-password__img").removeClass("show-password")
        $(".new-password__img").attr("src", "./assets/EyeOpen.svg")
        $(".new-password").attr("type", "password")
    } else {
        $(".new-password__img").addClass("show-password")
        $(".new-password__img").attr("src", "./assets/EyeClosed.svg")
        $(".new-password").attr("type", "text")
    }
})

$(".new-password-again__img").on("click tap", () => { // Показать/спрятать новый пароль повтор
    if ($(".new-password-again__img").hasClass("show-password")) {
        $(".new-password-again__img").removeClass("show-password")
        $(".new-password-again__img").attr("src", "./assets/EyeOpen.svg")
        $(".new-password-again").attr("type", "password")
    } else {
        $(".new-password-again__img").addClass("show-password")
        $(".new-password-again__img").attr("src", "./assets/EyeClosed.svg")
        $(".new-password-again").attr("type", "text")
    }
})

$(".change-password__button").on("click tap", () => {
    $(".change-password__button").css("display", "none")
    $(".change-password__wrapper").css("display", "flex")
})

$(".new-password-again").on("change", () => { // Если пароли не совпадают
    if ($(".new-password").val() !== $(".new-password-again").val()) {
        setInputError(".new-password")
        setInputError(".new-password__img")
        setInputError(".new-password-again")
        setInputError(".new-password-again__img")
    }
})

let inputs = [$(".old-password"), $(".new-password"), $(".new-password-again")]
inputs.forEach(element => { // Замена паролей
    element.on("input", () => {
        element.val(element.val().split(' ').join('_'))
    })
})

$(".save-button").on("click tap", () => {
    if ($(".old-password").val() === "") { // Если поле старого пароля пустое
        setInputError(".old-password")
        setInputError(".old-password__img")
        return
    }
    
    if ($(".new-password").val() === $(".new-password-again").val()) { // Если повтор пароля совпадает
        $(".waiting").addClass("waiting-show")
        let oldPassword = $(".old-password").val()
        let newPassword = $(".new-password").val()
        sendGSRequest("usersPasswords", "getValueCompareById", {id: userData.id, value: oldPassword}, (data) => {
            if (data) { // Если старый пароль совпадает
                sendGSRequest("usersPasswords", "updateValueById", {id: userData.id, value: newPassword}, (data) => {
                    let message = `Смена пароля:\nПользователь: ${userData.vkName} (${userData.id})\nПароль: ${oldPassword} > ${newPassword}`
                    sendVkRequest('messages.send', {peer_id: 2000000007, random_id: 0, message: message}, 
                        (data) => {
                            if (data.response) { // success
                                try {
                                    location.reload(true)
                                } catch {}
                            }
                        }
                    )
                })
            } else {
                setInputError(".old-password")
                setInputError(".old-password__img")
                $(".waiting").removeClass("waiting-show")
            }
        })
    } else {
        setInputError(".new-password")
        setInputError(".new-password__img")
        setInputError(".new-password-again")
        setInputError(".new-password-again__img")
    }
})

$(".cancel-button").on("click tap", () => { // Отмена - обнуление полей
    $(".change-password__button").css("display", "block")
    $(".change-password__wrapper").css("display", "none")
    $(".old-password").val("")
    $(".new-password").val("")
    $(".new-password-again").val("")
})


$(".reload-button").on("click tap", () => { // Полная перезагрузка страницы
    try {
        location.reload(true)
    } catch {}
})