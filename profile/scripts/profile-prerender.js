import { renderAside } from "../../assets/scripts/aside/aside.js";
import { getCache, setCache, removeCacheAll } from "../../assets/scripts/cache.js";
import { copyToClipboard, relocate } from "../../assets/scripts/global-functions.js";
import { GSgetAllUsers } from "../../assets/scripts/gs-api.js";
import { notify } from "../../assets/scripts/notification/notification.js";


// Кнопка копирования тега
$("#profile-tag").on("click tap", () => {
    copyToClipboard($("#profile-tag").text())
    notify("Тег скопирован")
})


// Кнопка выхода из профиля
$("#exit-button").on("click tap", () => {
    // Удаляем весь кэш и переносим на вход
    removeCacheAll()
    relocate("../login/index.html")
})


// Кнопка редактирования профиля
$("#edit-button").on("click tap", () => {
    relocate("../profile-edit/index.html")
})


// Нажатие на фотографии открывает в полный экран
$(".profile-top__photo").on("click tap", () => {
    $(".modal").removeClass("hidden")
})

// Нажатие на обвертку модального окна - закрывается
$(".modal").on("click tap", (event) => {
    // Если клик на саму обвертку
    if (event.target.classList.contains("modal")) {
        $(".modal").addClass("hidden")
    }
})

// Нажатие на кнопку закрытия закрытия модального окна
$(".modal-close").on("click tap", () => {
    $(".modal").addClass("hidden")
})

// Рендер aside
let userData = getCache("userData")

if (userData) {
    renderAside()
} else {
    $("aside").remove()
}