import { renderAside } from "../../assets/scripts/aside/aside.js";
import { getCache, setCache } from "../../assets/scripts/cache.js";
import { GSgetAllCountries, GSupdateUserFavourite } from "../../assets/scripts/gs-api.js";
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
                <a class="button-content" href="../country/index.html?id=${country.id}">
                    <img src="${country.photo}" alt="vk-photo">
                    <div class="button-names">
                        <p class="text-cut js-country-name">${country.name}</p>
                        <h5 class="text-cut text-secondary js-country-tag">${country.tag}</h5>
                    </div>
                </a>
                <img class="button-favourite" id="${country.id}" src="../assets/images/icons/Favourite.svg" alt="favourite">
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
        for (let fav of userFavourite.countries) {
            $("#" + fav).addClass("show")
        }

        // Удаляем кнопки "В избранные" у своей страны
        $(`#C-${userData.id}`).remove()


        // Рендерим aside
        renderAside()


        // Действие при нажатии на кнопку "В избранные"
        $(".button-favourite").unbind()
        $(".button-favourite").on("click tap", (event) => {
            // Если страна в избранных - удаляем, если нет - добавляем
            if ($("#" + event.target.id).hasClass("show")) {
                $("#" + event.target.id).removeClass("show")

                // Находим индекс айдишника и удаляем его из массива
                userFavourite.countries.splice(userFavourite.countries.indexOf(event.target.id), 1)
            } else {
                $("#" + event.target.id).addClass("show")
                userFavourite.countries.push(event.target.id)
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
    $("#countries-search").trigger("input")
}


// Если есть список всех стран - рендерим из кэша и потом загружаем
if (allСountries) {
    renderCountries(allСountries)
    GSgetAllCountries({type: "all", data: null}, (data) => {
        allСountries = data
        setCache("allСountries", data)
        renderCountries(data)
    })
} else {
    loading()
    GSgetAllCountries({type: "all", data: null}, (data) => {
        loading(false)

        allСountries = data
        setCache("allСountries", data)
        renderCountries(data)
    })
}