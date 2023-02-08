import {updateData, setInputError} from "./scripts-base.js"

// window.localStorage.removeItem("userData")

// localStorage userData, allUsers
let userData = JSON.parse(window.localStorage.getItem("userData"))
let authorized = userData ? true : false

if (!authorized) {
    alert("Эта страница доступна только авторизованным пользователям!")
    window.location.href = "./index.html"
}

$(".password-block__content-text").text(`Ваш текущий пароль: ${userData.password[0]}********${userData.password.slice(-1)}`)

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

$(".new-password-again").on("change", () => {
    if ($(".new-password").val() !== $(".new-password-again").val()) {
        setInputError(".new-password")
        setInputError(".new-password__img")
        setInputError(".new-password-again")
        setInputError(".new-password-again__img")
    }
})

let inputs = [$(".old-password"), $(".new-password"), $(".new-password-again")]
inputs.forEach(element => {
    element.on("input", () => {
        element.val(element.val().split(' ').join('_'))
    })
})

$(".save-button").on("click tap", () => {
    if ($(".old-password").val() === "" || $(".old-password").val() !== userData.password) {
        setInputError(".old-password")
        setInputError(".old-password__img")
        return
    }

    if ($(".new-password").val() === $(".new-password-again").val()) {
        userData.password = $(".new-password").val()
        updateData("users/" + userData.id, userData, (data) => {
            window.localStorage.setItem("userData", JSON.stringify(userData))
            $(".change-password__button").css("display", "block")
            $(".change-password__wrapper").css("display", "none")
            location.reload()
        })
    } else {
        setInputError(".new-password")
        setInputError(".new-password__img")
        setInputError(".new-password-again")
        setInputError(".new-password-again__img")
    }
})

$(".cancel-button").on("click tap", () => {
    $(".change-password__button").css("display", "block")
    $(".change-password__wrapper").css("display", "none")
    $(".old-password").val("")
    $(".new-password").val("")
    $(".new-password-again").val("")
})