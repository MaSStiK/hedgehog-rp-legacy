import { getCache, setCache, removeCache } from "../../assets/scripts/cache.js"
import { renderNavigation } from "../../assets/scripts/nav/nav-render.js" // Заного рендерить навигацию


// Нажатие на фотографии открывает в полный экран
$("#open-modal").on("click tap", () => {
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