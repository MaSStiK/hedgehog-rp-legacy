import {logger, createNotification, sendGSRequest} from "../scripts-base.js"

// localStorage userData
let userData = null
try { // Пробуем получить информацию о пользователе, если не удается спарсить то удаляем
    userData = JSON.parse(localStorage.getItem("userData"))
} catch {
    logger("[-] Error in userData, deleting...")
    localStorage.removeItem("userData")
}
const authorized = userData ? true : false

$("nav").append(`
    <div class="nav-wrapper">
        <img class="nav__logo" src="../assets/logo/main-logotype.png" alt="logotype">
        ${authorized // Если авторизован - рендерим кнопку профиля, иначе - кнопку входа
            ? `<a href="../profile/index.html?id=${userData.id}" class="secondary-button nav__button-authorized">
                    <img class="authorization-avatar" src="${userData.avatar}" alt="avatar">
                    <div class="authorization-names">
                        <p class="h2-normal primary-text authorization-name">${userData.vkName}</p>
                        <p class="h3-little secondary-text authorization-tag">@${userData.tag}</p>
                    </div>
                </a>`
            : `<a href="../authorization/index.html" class="primary-button nav__button-authorization">Авторизация</a>`
        }
        <div class="nav__line"></div>
        <a href="../home/index.html" class="secondary-button">Главная</a>
        <a href="../news/index.html" class="secondary-button">Новости</a>
        <a href="../countries/index.html" class="secondary-button">Страны</a>
        <a href="../nations/index.html" class="secondary-button">Нации</a>
        <a href="../tools/index.html" class="secondary-button">Инструменты</a>
        <div class="nav__line"></div>
        <a href="../about/index.html" class="secondary-button">О нас</a>
        <a href="../updates/index.html" class="secondary-button">Обновления</a>
    </div>
    <div class="nav-phone__wrapper">
        <div class="nav-phone">
            <div class="nav-phone__burger-wrapper">
                <img class="nav-phone__burger" src="../assets/Burger.svg" alt="burger">
            </div>
            ${authorized // Если авторизован - рендерим кнопку профиля, иначе - кнопку входа
                ? `<a href="../profile/index.html?id=${userData.id}" class="secondary-button nav__button-authorized">
                        <img class="authorization-avatar" src="${userData.avatar}" alt="avatar">
                        <div class="authorization-names">
                            <p class="h2-normal primary-text authorization-name">${userData.vkName}</p>
                            <p class="h3-little secondary-text authorization-tag">@${userData.tag}</p>
                        </div>
                    </a>`
                : `<a href="../authorization/index.html" class="primary-button nav__button-authorization">Авторизация</a>`
            }
        </div>
        <div class="nav-phone__content">
            <img class="nav-phone__logo" src="../assets/logo/main-logotype.png" alt="logotype">
            <div class="nav__line"></div>
            <a href="../home/index.html" class="h2-normal primary-text nav-phone__button">Главная</a>
            <a href="../news/index.html" class="h2-normal primary-text nav-phone__button">Новости</a>
            <a href="../countries/index.html" class="h2-normal primary-text nav-phone__button">Страны</a>
            <a href="../nations/index.html" class="h2-normal primary-text nav-phone__button">Нации</a>
            <a href="../tools/index.html" class="h2-normal primary-text nav-phone__button">Инструменты</a>
            <div class="nav__line"></div>
            <a href="../about/index.html" class="h2-normal primary-text nav-phone__button">О нас</a>
            <a href="../updates/index.html" class="h2-normal primary-text nav-phone__button">Обновления</a>
        </div>
    </div>
`)

// Можно выйти но при этом информация сохранится

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
    location.href = "../home/index.html"
})

$(".nav-phone__logo").on("click tap", () => {
    location.href = "../home/index.html"
})

const userPassword = localStorage.getItem("userPassword")
if (authorized) {
    if (userPassword) { // Если пароль сохранен
        sendGSRequest("usersPasswords", "getValueCompareById", {id: userData.id, value: userPassword}, (data) => { // Сравниваем пароль
            if (!data) { // Если он не совпадает то выкидываем на вход
                localStorage.setItem("passwordChanged", "passwordChanged")
                location.href = "../authorization/index.html"
            }
        })
    } else { // На всякий случай хз (к примеру если хеш удалится)
        localStorage.setItem("passwordChanged", "passwordChanged")
        location.href = "../authorization/index.html"
    }
} 
