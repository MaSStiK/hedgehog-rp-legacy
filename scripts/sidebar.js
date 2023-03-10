import {createNotification} from "./scripts-base.js"

// localStorage userData
let userData
try {
    userData = JSON.parse(localStorage.getItem("userData"))
} catch { // Если юзердата сломалась то удаляем ее
    localStorage.removeItem("userData")
    userData = null
}
let authorized = userData ? true : false

// Можно выйти но при этом информация сохранится

if (authorized) { // Профиль в сайдбаре если авторизован
    $(".authorization-avatar").css("background-image", `url(${userData.avatar})`)
    $(".authorization-name").text(`${userData.name} ${userData.surname}`)
    $(".authorization-id").text("@" + userData.uid)
    $(".nav__button-authorized").attr("href", "./profile.html?id=" + userData.id)
    $(".nav__button-authorization").attr("style", "display: none !important")
    $(".nav__button-authorized").attr("style", "display: flex !important")
}

$(".nav-phone__burger-wrapper").on("click tap", () => {
    if($(".nav-phone__burger-wrapper").hasClass("nav-phone__burger-active")) {
        $(".nav-phone__burger-wrapper").removeClass("nav-phone__burger-active")
        $("nav").removeClass("nav-opened")
        $(".nav-phone__content").attr("style", "display: none !important")
    } else {
        $(".nav-phone__burger-wrapper").addClass("nav-phone__burger-active")
        $("nav").addClass("nav-opened")
        $(".nav-phone__content").attr("style", "display: flex !important")
    }
})

$(".nav__logo").on("click tap", () => {
    location.href = "./index.html"
})

$(".nav-phone__logo").on("click tap", () => {
    location.href = "./index.html"
})