import { removeCacheAll } from "../../assets/scripts/cache.js";
import { copyToClipboard, relocate } from "../../assets/scripts/global-functions.js";
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
    relocate("../login/")
})


// Кнопка редактирования профиля
$("#edit-button").on("click tap", () => {
    relocate("../profile-edit/")
})


// Нажатие на фотографии открывает в полный экран
$(".profile-top__photo").on("click tap", () => {
    $(".modal-photo-full").removeClass("hidden")
})

// Нажатие на обвертку модального окна - закрывается
$(".modal-photo-full").on("click tap", (event) => {
    // Если клик на саму обвертку
    if (event.target.classList.contains("modal-photo-full")) {
        $(".modal-photo-full").addClass("hidden")
    }
})

// Нажатие на кнопку закрытия фотографии
$("#photo-full-close").on("click tap", (event) => {
    $(".modal-photo-full").addClass("hidden")
})