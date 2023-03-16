import {logger, createNotification, sendGSRequest} from "./scripts-base.js"

// localStorage userData
let userData = null
try { // Пробуем получить информацию о пользователе, если не удается спарсить то удаляем
    userData = JSON.parse(localStorage.getItem("userData"))
} catch {
    logger("[-] Error in userData, deleting...")
    localStorage.removeItem("userData")
}
let authorized = userData ? true : false

// Можно выйти но при этом информация сохранится

if (authorized) { // Профиль в сайдбаре если авторизован
    $(".authorization-avatar").css("background-image", `url(${userData.avatar})`)
    $(".authorization-name").text(`${userData.vkName}`)
    $(".authorization-id").text("@" + userData.uid)
    $(".nav__button-authorized").attr("href", "./profile.html?id=" + userData.id)
    $(".nav__button-authorization").attr("style", "display: none !important")
    $(".nav__button-authorized").attr("style", "display: flex !important")
} else {
    $(".nav__button-authorization").css("opacity", "1");
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

const userPassword = localStorage.getItem("userPassword")
if (authorized) {
    if (userPassword) { // Если пароль сохранен
        sendGSRequest("usersPasswords", "getValueCompareById", {id: userData.id, value: userPassword}, (data) => { // Сравниваем пароль
            if (!data) {
                localStorage.setItem("passwordChanged", "passwordChanged")
                location.href = "./authorization.html"
            }
        })
    } else {
        localStorage.setItem("passwordChanged", "passwordChanged")
        location.href = "./authorization.html"
    }
} 
