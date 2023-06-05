import { getCache } from "../../assets/scripts/cache.js";
import { copyToClipboard, getUrlParams, linkTo } from "../../assets/scripts/global-functions.js";
import { GSgetRowById } from "../../assets/scripts/gs-api.js";
import { notify } from "../../assets/scripts/notification/notification.js";
import { VKsendRequest, VKsendMessage, VKsendError } from "../../assets/scripts/vk-api.js"


// Параметр из сылки. id = int
let urlParams = getUrlParams()
let userData = getCache("userData")

// Если нет юзердаты и id в ссылке не указан - перекинет на вход
if (!userData && Object.keys(urlParams).length === 0) {
    linkTo("../login/")
}

// Выбор айди для рендера (Если указан id то рендер его, если id нету но есть авторизация - рендер авторизованого)
let user_id = urlParams?.id ? urlParams.id : userData.id

console.log(!isNaN(user_id))

function renderUser(user_id) {
    GSgetRowById("users", {id: user_id}, (data) => {
        console.log(data);

        
        // Находим информацию о пользователе
        VKsendRequest('users.get', {user_id: user_id, fields: "photo_200"}, (vkData) => {
            vkData = vkData.response[0]
            $("#profile-vk-button").attr("href", "https://vk.com/id" + user_id)
            $("#profile-vk-button").append(`
                <img id="profile-vk-photo" src="${vkData.photo_200}" alt="vk-photo">
                <p class="text-cut" id="profile-vk-name">${vkData.first_name} ${vkData.last_name}</p>
            `);
        })
    })
}


// Если id в поисковой строке цифрами - то обычный рендер по id
if (!isNaN(user_id)) {
    renderUser(user_id)
} else { // Иначе рендер по тегу

}
