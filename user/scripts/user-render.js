import { getCache, setCache } from "../../assets/scripts/cache.js";
import { getUrlParams, relocate } from "../../assets/scripts/global-functions.js";
import { GSgetUserById, GSgetUserByTag } from "../../assets/scripts/gs-api.js";
import { notify } from "../../assets/scripts/notification/notification.js";
import { VKsendRequest, VKsendMessage, VKsendError } from "../../assets/scripts/vk-api.js"
import { loading } from "../../assets/scripts/loading/loading.js"


// Параметр из сылки. id = int
let urlParams = getUrlParams()
let userData = getCache("userData")

// Если нет юзердаты и id в ссылке не указан - перекинет на вход
if (!userData && Object.keys(urlParams).length === 0) {
    relocate("../login/index.html")
}


// Функция рендера пользователя
function renderUser(user_data) {
    // Если юзер рендерит свою страницу (Если пользователь не авторизован, то точно не сработает)
    if (user_data.id === userData?.id) {
        $("#exit-button").removeClass("hidden")
        $("#edit-button").removeClass("hidden")
        // $("#report-button").remove()
        $(".user-top__name").addClass("self-render") // Добавляем класс для большего отступа
        setCache("userData", user_data)
    } else {
        // $("#report-button").removeClass("hidden")
        $("#exit-button").remove()
        $("#edit-button").remove()
    }

    // Находим информацию о пользователе в вк
    VKsendRequest('users.get', {user_id: user_data.id, fields: "photo_200"}, (vkData) => {
        vkData = vkData.response[0]
        $("#user-vk-button").attr("href", "https://vk.com/id" + user_id)
        $("#user-vk-button").append(`
            <img id="user-vk-photo" src="${vkData.photo_200}" alt="vk-photo">
            <p class="text-cut" id="user-vk-name">${vkData.first_name} ${vkData.last_name}</p>
        `)
    })

    // Заполняем поля
    $("#user-tag").text(user_data.tag)
    $("#user-name").text(user_data.name)
    $("#user-photo").attr("src", user_data.photo)
    $("#photo-full").attr("src", user_data.photo)

    // Меняем название страницы
    $('title').text(user_data.name)

    // Дата появления в беседе
    let regDate = new Date(Number(user_data.reg_date))

    // let regHours = regDate.getHours().toString()
    // regHours = regHours.length !== 2 ? "0" + regHours : regHours // Формат часов 00

    // let regMinutes = regDate.getMinutes().toString()
    // regMinutes = regMinutes.length !== 2 ? "0" + regMinutes : regMinutes // Формат минут 00

    let regDay = regDate.getDate().toString()
    regDay = regDay.length !== 2 ? "0" + regDay : regDay // Формат дня 00

    let regMonth = (regDate.getMonth() + 1).toString() // Добавляем 1 т.к. месяц начинается с нуля
    regMonth = regMonth.length !== 2 ? "0" + regMonth : regMonth // Формат месяца 00

    let regYear = regDate.getFullYear()

    // $("#user-date").val(`${regHours}:${regMinutes} ${regDay}.${regMonth}.${regYear}`)
    $("#user-date").val(`${regDay}.${regMonth}.${regYear}`)
    $("#user-bio").text(user_data.bio !== "" ? user_data.bio : " ")


    // Если высота описания больше 100px, то показывается кнопка для раскрывания
    if ($("#user-bio").height() > 100) {
        $(".user-bio-show").removeClass("hidden")
        $("#user-bio").removeClass("js-show-button")

        // Раскрытие описания
        $(".user-bio-show").on("click tap", () => {
            if ($("#user-bio").hasClass("show")) {
                $("#user-bio").removeClass("show")
                $(".user-bio-show").text("Нажмите чтобы раскрыть")
            } else {
                $("#user-bio").addClass("show")
                $(".user-bio-show").text("Нажмите чтобы свернуть")
            }
        })
    } else { // Иначе удаляем кнопку
        $(".user-bio-show").remove()
    }


    // Отключаем анимацию загрузки
    loading(false)
}


// Выбор айди для рендера (Если указан id то рендер его, если id нету но есть авторизация - рендер авторизованого)
let user_id = urlParams?.id ? urlParams.id : userData.id

// Если id в поисковой строке цифрами - то обычный рендер по id
if (!isNaN(user_id)) {
    loading()
    console.log("Render by id " + user_id);

    GSgetUserById({id: user_id}, (data) => {
        // Если данные найдены то рендердерим, если нет, то ошибка и на главную
        if (Object.keys(data).length > 0) { 
            renderUser(data)
        } else {
            VKsendError("Такого пользователя не существует!", "Invalid id")
            relocate("../home/index.html")
        }        
    })

} else { // Иначе рендер по тегу
    // Если в начале тега нету символа @, то добавляем
    if (user_id[0] !== "@") {
        user_id = "@" + user_id
    }

    loading()
    console.log("Render by tag " + user_id);

    GSgetUserByTag({tag: user_id}, (data) => {
        // Если данные найдены то рендердерим, если нет, то ошибка и на главную
        if (Object.keys(data).length > 0) {
            renderUser(data)
        } else {
            VKsendError("Такого пользователя не существует!", "Invalid tag")
            relocate("../home/index.html")
        }  
    })
}
