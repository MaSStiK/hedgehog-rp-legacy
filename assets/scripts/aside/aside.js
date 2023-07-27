import { getCache, setCache } from "../cache.js"
import { GSgetAllUsers, GSgetAllCountries } from "../gs-api.js"


// Рендерим кнопки юзеров в aside
function renderUsers(data) {
    $("aside").removeClass("hidden")
    $("#aside-users").html("")
    if (data.length > 0) {
        $("#aside-users").removeClass("hidden")
    }

    let allUsers = getCache("allUsers")

    for (let fav of data) {
        // Откидываем первые 2 символа, т.к. юзер с чистым айди без буквы
        fav = fav.substring(2)

        let user = allUsers.find(user => user.id.toString() === fav)
        if (user !== undefined) {
            $("#aside-users").append(`
                <button class="aside__button-container">
                    <a class="aside__button" href="../user/index.html?id=${user.id}">
                        <img src="${user.photo}" alt="vk-photo">
                        <div class="aside__button-names">
                            <p class="text-cut js-user-name">${user.name.split(" ")[0]}</p>
                        </div>
                    </a>
                </button>
            `)
        }
    }
}


// Рендерим кнопки стран в aside
function renderCountries(data) {
    $("aside").removeClass("hidden")
    $("#aside-countries").html("")
    if (data.length > 0) {
        $("#aside-countries").removeClass("hidden")
    }

    let allСountries = getCache("allСountries")

    for (let fav of data) {
        let country = allСountries.find(country => country.id.toString() === fav)
        if (country !== undefined) {
            $("#aside-countries").append(`
                <button class="aside__button-container">
                    <a class="aside__button" href="../country/index.html?id=${country.id}">
                        <img src="${country.photo}" alt="vk-photo">
                        <div class="aside__button-names">
                            <p class="text-cut js-country-name">${country.name.split(" ")[0]}</p>
                        </div>
                    </a>
                </button>
            `)
        }
        
    }
}



// Рендер Избранных (aside)
export function renderAside() {
    let userFavourite = JSON.parse(getCache("userData").favourite)

    let allUsers = getCache("allUsers")
    let allСountries = getCache("allСountries")


    // Обнуляем
    $("#aside-users").html("")
    $("#aside-countries").html("")

    $("#aside-users").addClass("hidden")
    $("#aside-countries").addClass("hidden")

    // Если информация есть - рендерим
    if (userFavourite.users.length > 0 || userFavourite.countries.length > 0) {
        if (userFavourite.users.length > 0) {
            $("#aside-users").removeClass("hidden")

            // Если есть информация - рендерим из хеша и потом обновляем
            if (allUsers) {
                renderUsers(JSON.parse(getCache("userData").favourite).users)

                GSgetAllUsers({type: "all", data: null}, (data) => {
                    setCache("allUsers", data)
                    renderUsers(JSON.parse(getCache("userData").favourite).users)
                })
            } else {
                GSgetAllUsers({type: "all", data: null}, (data) => {
                    setCache("allUsers", data)
                    renderUsers(JSON.parse(getCache("userData").favourite).users)
                })
            }
        }
        

        if (userFavourite.countries.length > 0) {
            $("#aside-countries").removeClass("hidden")

            // Если есть информация - рендерим из хеша и потом обновляем
            if (allСountries) {
                renderCountries(JSON.parse(getCache("userData").favourite).countries)
                GSgetAllCountries({type: "all", data: null}, (data) => {
                    setCache("allСountries", data)
                    renderCountries(JSON.parse(getCache("userData").favourite).countries)
                })
            } else {
                GSgetAllCountries({type: "all", data: null}, (data) => {
                    setCache("allСountries", data)
                    renderCountries(JSON.parse(getCache("userData").favourite).countries)
                })
            }
        }

        console.log(`Aside rendered\nusers: ${userFavourite.users.length}\ncountries: ${userFavourite.countries.length}`);

    } else {
        $("aside").addClass("hidden")
    }
}


let userData = getCache("userData")

// Рендерим aside в том случае, если есть юзердата
if (userData) {
    $("aside section").append(`
        <!-- Список избранных -->
        <h4 id="aside-title">Избранные</h4>
        <div id="aside-users"></div>
        <div id="aside-countries"></div>
    `)
    renderAside()
} else {
    // Иначе удаляем
    $("aside").remove()
}