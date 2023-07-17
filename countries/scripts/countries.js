import { getCache, setCache } from "../../assets/scripts/cache.js";
import { GSgetAllcountries, GSupdateUserFavourite } from "../../assets/scripts/gs-api.js";
import { loading } from "../../assets/scripts/loading/loading.js";

let userData = getCache("userData")
let allСountries = getCache("allСountries")

// Переменая для таймера сейва информации
let saveFavourite = null


// Функция рендера стран
function renderCountries(countries) {
    // Очищаем контейнер перед рендером
    $(".countries-list").html("")


    // Фильтр стран в алфавитном порядке
    let sortedCountries = countries.sort((a,b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    })

    // Заполняем список всех стран
    for (let country of sortedCountries) {
        $(".countries-list").append(`
            <div class="button-container" id="country-${country.id}">
                <a class="button-content" href="../profile/index.html?id=${country.id}">
                    <img src="${country.photo}" alt="vk-photo">
                    <div class="button-names">
                        <p class="text-cut js-country-name">${country.name}</p>
                        <h5 class="text-cut text-secondary js-country-tag">${country.tag}</h5>
                    </div>
                </a>
                <img class="button-favourite" id="u-${country.id}" src="../assets/images/icons/Favourite.svg" alt="favourite">
            </div>
        `)
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
                userFavourite[event.target.id] = event.target.id
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
                // Рендерим aside
                renderAside(userFavourite)

                GSupdateUserFavourite({id: userData.id, data: userFavourite}, (data) => {
                    // console.log(data)
                })
            }, 1000)
        })
    }


    // Тригерим инпут после рендера
    $("#countries-search").trigger("input")
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

            let country = allСountries.find(country => country.id.toString() === fav)
            $("aside section").append(`
                <a class="aside__button" href="../profile/index.html?id=${country.id}">
                    <img src="${country.photo}" alt="vk-photo">
                    <div class="aside__button-names">
                        <p class="text-cut js-country-name">${country.name.split(" ")[0]}</p>
                    </div>
                </a>
            `)
        }
    } else {
        // Если нету - скрываем aside
        $("aside").addClass("hidden")
    }
}


// Если есть список всех стран - рендерим из кэша и потом загружаем
if (allСountries) {
    renderCountries(allСountries)
    GSgetAllcountries({type: "all", data: null}, (data) => {
        setCache("allСountries", data)
        renderCountries(data)
    })
} else {
    // Удаляем список избранных
    $("aside").remove()

    loading()
    GSgetAllcountries({type: "all", data: null}, (data) => {
        loading(false)
        setCache("allСountries", data)
        renderCountries(data)
    })
}