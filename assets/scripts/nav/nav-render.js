import { getCache, setCache, removeCache } from "../cache.js"
import { relocate } from "../global-functions.js"
import { GScheckPassword } from "../gs-api.js"

let passwordChecked = false

// Рендер всей навигации
export function renderNavigation() {
    let userData = getCache("userData")
    let userCountryData = getCache("userCountryData")
    let userPassword = getCache("userPassword")
    
    $("main nav").html(
        `<div class="main-nav__phone">
            <!-- Кнопка профиля в топ навигации -->
            ${userData // Если есть информация о юзере
            ? `<button class="transparent" id="nav__profile">
                <img src="${userData.photo}" alt="avatar" id="nav__profile-image">
                <h5 class="text-cut" id="nav__profile-name">${userData.name.split(" ")[0]}</h5>
                </button>`
            : `` // Иначе нечгео
            }
    
            <!-- Кнопка страны в топ навигации -->
            ${userCountryData // Если есть информация о стране юзере
            ? `<button class="transparent" id="nav__country">
                    <img src="../assets/images/base/base-country.png" alt="country" id="nav__country-image">
                    <h5 class="text-cut" id="nav__country-title">Название</h5>
                </button>`
            : `` // Иначе нечгео
            }
    
            <!-- Кнопка раскрывающая навигацию -->
            <button class="transparent" id="nav__burger">
                <img src="../assets/images/icons/Burger.svg" alt="burger">
            </button>
        </div>
        <div class="main-nav__content-wrapper">
            <div class="main-nav__content">
    
                <!-- Логотип в верху -->
                <div class="main-nav__logotype" id="nav__logo">
                    <img src="../assets/images/logo/logo.png" alt="logo">
                </div>
    
                <!-- Список всех ссылок -->
                <li>

                    <!-- Кнопка авторизации или профиль юзера -->
                    ${userData // Если есть информация о юзере
                    ? `<ul class="main-nav__link"><a href="../profile/index.html?id=${userData.id}" id="nav-full__profile">
                            <img src="${userData.photo}" alt="avatar" id="nav-full__profile-image">
                            <div class="main-nav__link-text">
                                <h5 class="text-cut" id="nav-full__profile-name">${userData.name}</h5>
                                <h6 class="text-cut" id="nav-full__profile-tag">${userData.tag}</h6>
                            </div>
                        </a></ul>`
                    : `<ul class="main-nav__link"><a href="../login/" id="nav-full__authorization">Авторизация</a></ul>` // Иначе кнопка входа
                    }
    
                    <!-- Кнопка страны (Если у юзера она есть) -->
                    ${userCountryData // Если есть информация о стране юзере
                    ? `<ul class="main-nav__link"><a href="../country/index.html?id=${userData.id}" id="nav-full__country">
                            <img src="../assets/images/base/base-country.png" alt="country" id="nav-full__country-image">
                            <div class="main-nav__link-text">
                                <h5 class="text-cut" id="nav-full__country-title">Название</h5>
                                <h6 class="text-cut" id="nav-full__country-role">Президент</h6>
                            </div>
                        </a></ul>`
                    : `` // Иначе нечгео
                    }
                    
                    <!-- Остальные ссылки и делители -->
                    <div class="main-nav__divider"></div>
                    <ul class="main-nav__link"><a href="../home/index.html">Главная</a></ul>
                    <ul class="main-nav__link"><a href="#">Новости</a></ul>
                    <ul class="main-nav__link"><a href="../users/index.html">Участники</a></ul>
                    <ul class="main-nav__link"><a href="#">Нации</a></ul>
                    <ul class="main-nav__link"><a href="../countries/index.html">Страны</a></ul>
                    <div class="main-nav__divider"></div>
                    <ul class="main-nav__link"><a href="#">Помощь</a></ul>
                    <ul class="main-nav__link"><a href="#">О нас</a></ul>
                </li>
            </div>
        </div>`
    )
    
    if (userData && !passwordChecked) {
        GScheckPassword({id: userData.id, password: userPassword}, (data) => {
            if (Object.keys(data).length > 0) { // Если информация есть - обновляем
                setCache("userData", data)
                // Ставим что проверики пароль и обновляем навигацию
                passwordChecked = true
                renderNavigation()
            } else { // Если нету - выкидываем из профиляы
                removeCache("userData")
                removeCache("userPassword")
                setCache("password-changed", "password-changed")
                relocate("../login/index.html")
            }
        })
    }


    // Нажатие логотип - переход на вкладку дом
    $("#nav__logo img").unbind()
    $("#nav__logo img").on("click tap", () => { 
        relocate("../home/index.html")
    })
    

    // Открытие навигации
    $("#nav__burger").unbind()
    $("#nav__burger").on("click tap", () => { 
        $(".main-nav__content-wrapper").toggleClass("show");
        $(".main-nav__content").toggleClass("show");
        $(".main-nav__phone").toggleClass("hide-border-part");
        $("#nav__burger").toggleClass("clicked");
    })


    // Перенос в профиль на телефонной версии
    $("#nav__profile").unbind()
    $("#nav__profile").on("click tap", () => {
        relocate(`../profile/index.html?id=${userData.id}`)
    })

    // Перенос в страну на телефонной версии
    $("#nav__country").unbind()
    $("#nav__country").on("click tap", () => {
        relocate(`../country/index.html?id=${userData.id}`)
    })
}

renderNavigation() // Рендерим сразу