import { getCache, setCache } from "../../assets/scripts/cache.js";
import { GSgetAllUsers, GSupdateUserFavourite } from "../../assets/scripts/gs-api.js";
import { loading } from "../../assets/scripts/loading/loading.js";

let userData = getCache("userData")
let allUsers = getCache("allUsers")

// Переменая для таймера сейва информации
let saveFavourite = null


// Функция рендера юзеров
function renderUsers(users) {
    // Очищаем контейнер перед рендером
    $(".users-list").html("")

    // Заполняем список всех юзеров
    for (let user of users) {
        $(".users-list").append(`
            <div class="users-list__button-container" id="user-${user.id}">
                <a class="users-list__button" href="../profile/index.html?id=${user.id}">
                    <img src="${user.photo}" alt="vk-photo">
                    <div class="users-list__button-names">
                        <p class="text-cut js-user-name">${user.name}</p>
                        <h5 class="text-cut text-secondary js-user-tag">${user.tag}</h5>
                    </div>
                </a>
                <img class="users-list__favourite" id="u-${user.id}" src="../assets/images/icons/Favourite.svg" alt="favourite">
            </div>
        `)
    }


    // Удаляем кнопки "В избранные" если нету юзердаты
    if (!userData) {
        $(".users-list__favourite").remove()
    } else {
        // Удаляем все отметки
        $(".users-list__favourite").removeClass("show")

        // Получаем список избранных
        let user_favourite = JSON.parse(userData.favourite)

        // Рендерим кнопки "В избранные"
        for (let fav in user_favourite) {
            $("#" + fav).addClass("show")
        }

        // Рендерим избранные
        renderAside(user_favourite)


        // Действие при нажатии на кнопку "В избранные"
        $(".users-list__favourite").unbind()
        $(".users-list__favourite").on("click tap", (event) => {
            // Если юзей в избранных - удаляем, если нет - добавляем
            if ($("#" + event.target.id).hasClass("show")) {
                $("#" + event.target.id).removeClass("show")
                delete user_favourite[event.target.id]
            } else {
                $("#" + event.target.id).addClass("show")
                user_favourite[event.target.id] = event.target.id
            }
            
            // Если таймер запущен - удаляем старыый и запускаем новый
            if (saveFavourite !== null) {
                clearTimeout(saveFavourite);
            }


            // Сохраняем избранные локально
            userData.favourite = JSON.stringify(user_favourite)
            setCache("userData", userData)


            // Если в течении 1 секунды не нажимали не на одну звезду, то сохраняем информацию
            saveFavourite = setTimeout(() => {
                // Рендерим aside
                renderAside(user_favourite)

                GSupdateUserFavourite({id: userData.id, data: user_favourite}, (data) => {
                    // console.log(data)
                })
            }, 1000)
        })
    }


    // Тригерим инпут после рендера
    $("#users-search").trigger("input")
}


// Рендер Избранных (aside)
function renderAside(favourites) {
    if (Object.keys(favourites).length > 0) { // Если информация есть - рендерим
        // Если есть - показываем aside
        $("aside").removeClass("hidden")
        $("aside section").html(`<h4 id="aside-title">Избранные</h4>`)


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


// Если есть список всех юзеров - рендерим из кэша и потом загружаем
if (allUsers) {
    renderUsers(allUsers)
    GSgetAllUsers({type: "all", data: null}, (data) => {
        setCache("allUsers", data)
        renderUsers(data)
    })
} else {
    // Удаляем список избранных
    $("aside").remove()

    loading()
    GSgetAllUsers({type: "all", data: null}, (data) => {
        loading(false)
        setCache("allUsers", data)
        renderUsers(data)
    })
}