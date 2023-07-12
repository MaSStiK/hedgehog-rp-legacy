import { getCache, removeCacheAll } from "../../assets/scripts/cache.js";
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
    relocate("../login/index.html")
})


// Кнопка редактирования профиля
$("#edit-button").on("click tap", () => {
    relocate("../profile-edit/index.html")
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



// Рендер избранных (aside)
function renderAside(favourites) {
    if (Object.keys(favourites).length > 0) { // Если информация есть - рендерим
        // Если есть - показываем aside
        $("aside").removeClass("hidden")
        $("aside section").html(`<h4 id="aside-title">Избранные</h4>`)

        let allUsers = getCache("allUsers")

        // Рендерим кнопки в aside
        for (let fav in favourites) {
            // Откидываем первые 2 символа
            fav = fav.substring(2)

            let user = allUsers.find(user => user.id.toString() === fav)
            $("aside section").append(`
                <a class="aside__button" href="../profile/index.html?id=${user.id}">
                    <img src="${user.photo}" alt="vk-photo">
                    <div class="aside__button-names">
                        <p class="text-cut js-user-name">${user.name.split(" ")[0]}</p>
                    </div>
                </a>
            `)
        }
    } else {
        // Если нету - скрываем aside
        $("aside").addClass("hidden")
    }
}

let userData = getCache("userData")

if (userData) {
    renderAside(JSON.parse(userData.favourite))
} else {
    $("aside").delete()
}