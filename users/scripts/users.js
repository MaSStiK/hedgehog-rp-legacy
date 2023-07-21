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


    // Фильтр юзеров в алфавитном порядке
    let sortedUsers = users.sort((a,b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    })

    // Заполняем список всех юзеров
    for (let user of sortedUsers) {
        // Не рендерим себя
        if (user.id.toString() !== userData.id) {
            $(".users-list").append(`
                <div class="button-container" id="user-${user.id}">
                    <a class="button-content" href="../profile/index.html?id=${user.id}">
                        <img src="${user.photo}" alt="vk-photo">
                        <div class="button-names">
                            <p class="text-cut js-user-name">${user.name}</p>
                            <h5 class="text-cut text-secondary js-user-tag">${user.tag}</h5>
                        </div>
                    </a>
                    <img class="button-favourite" id="U-${user.id}" src="../assets/images/icons/Favourite.svg" alt="favourite">
                </div>
            `)
        }
    }


    // Удаляем кнопки "В избранные" если нету юзердаты
    if (!userData) {
        $(".button-favourite").remove()
    } else {
        // Удаляем все отметки
        $(".button-favourite").removeClass("show")

        // Получаем список избранных
        let userFavourite = JSON.parse(userData.favourite)

        // Рендерим кнопки "В избранные"
        for (let fav in userFavourite) {
            $("#" + fav).addClass("show")
        }

        // Рендерим избранные
        renderAside(userFavourite)


        // Действие при нажатии на кнопку "В избранные"
        $(".button-favourite").unbind()
        $(".button-favourite").on("click tap", (event) => {
            // Если юзей в избранных - удаляем, если нет - добавляем
            if ($("#" + event.target.id).hasClass("show")) {
                $("#" + event.target.id).removeClass("show")
                delete userFavourite[event.target.id]
            } else {
                $("#" + event.target.id).addClass("show")
                userFavourite[event.target.id] = "true"
            }
            
            // Если таймер запущен - удаляем старыый и запускаем новый
            if (saveFavourite !== null) {
                clearTimeout(saveFavourite);
            }


            // Сохраняем избранные локально
            userData.favourite = JSON.stringify(userFavourite)
            setCache("userData", userData)


            // Если в течении 1 секунды не нажимали не на одну звезду, то сохраняем информацию
            saveFavourite = setTimeout(() => {
                console.log("Favourite saved")

                // Рендерим aside
                renderAside(userFavourite)

                GSupdateUserFavourite({id: userData.id, data: userFavourite}, (data) => {
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
    if (Object.keys(favourites).filter(user => user.startsWith("U-")).length > 0) { // Если информация есть - рендерим
        // Если есть - показываем aside
        $("aside").removeClass("hidden")
        $("aside section").html(`<h4 id="aside-title">Избранные</h4>`)


        // Рендерим кнопки в aside
        for (let fav in favourites) {
            // Если начинается id начинается C-
            if (fav.startsWith("U-")) {

                // Откидываем первые 2 символа, т.к. юзер с чистым айди без буквы
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
        allUsers = data
        setCache("allUsers", data)
        renderUsers(data)
    })
} else {
    // Удаляем список избранных
    $("aside").remove()

    loading()
    GSgetAllUsers({type: "all", data: null}, (data) => {
        loading(false)
        allUsers = data
        setCache("allUsers", data)
        renderUsers(data)
    })
}