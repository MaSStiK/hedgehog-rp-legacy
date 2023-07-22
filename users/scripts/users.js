import { renderAside } from "../../assets/scripts/aside/aside.js";
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


    // Если нету юзердаты, то удаляем кнопки "В избранные" и aside
    if (!userData) {
        $(".button-favourite").remove()
        $("aside").remove()
    } else {
        // Удаляем все отметки
        $(".button-favourite").removeClass("show")

        // Получаем список избранных
        let userFavourite = JSON.parse(userData.favourite)

        // Рендерим кнопки "В избранные"
        for (let fav of userFavourite.users) {
            $("#" + fav).addClass("show")
        }

        // Удаляем кнопки "В избранные" у себя
        $(`#U-${userData.id}`).remove()


        // Рендерим aside
        renderAside()


        // Действие при нажатии на кнопку "В избранные"
        $(".button-favourite").unbind()
        $(".button-favourite").on("click tap", (event) => {
            // Если юзер в избранных - удаляем, если нет - добавляем
            if ($("#" + event.target.id).hasClass("show")) {
                $("#" + event.target.id).removeClass("show")

                // Находим индекс айдишника и удаляем его из массива
                userFavourite.users.splice(userFavourite.users.indexOf(event.target.id), 1)
            } else {
                $("#" + event.target.id).addClass("show")
                userFavourite.users.push(event.target.id)
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
                renderAside()

                GSupdateUserFavourite({id: userData.id, data: userFavourite}, (data) => {
                    // console.log(data)
                })
            }, 1000)
        })
    }


    // Тригерим инпут после рендера
    $("#users-search").trigger("input")
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
    loading()
    GSgetAllUsers({type: "all", data: null}, (data) => {
        loading(false)
        
        allUsers = data
        setCache("allUsers", data)
        renderUsers(data)
    })
}