import { getCache } from "../../assets/scripts/cache.js";
import { copyToClipboard, getUrlParams, linkTo } from "../../assets/scripts/global-functions.js";
import { notify } from "../../assets/scripts/notification/notification.js";


// Параметр из сылки. id = int
let urlParams = getUrlParams()
let userData = getCache("userData")

// Если нет юзердаты и id в ссылке не указан - перекинет на вход
if (!userData && Object.keys(urlParams).length === 0) {
    linkTo("../login/")
}

// Выбор айди для рендера (Если указан id то рендер его, если id нету но есть авторизация - рендер авторизованого)
let user_id = urlParams?.id ? urlParams.id : userData.id

console.log(user_id);

$("#profile-tag").on("click tap", () => {
    copyToClipboard($("#profile-tag").text().substr(1))
    notify("Тег скопирован")
})