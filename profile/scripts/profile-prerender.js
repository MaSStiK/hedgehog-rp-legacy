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