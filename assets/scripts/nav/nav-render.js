import { getCache, setCache, removeCache, removeAll } from "../cache.js"
import { linkTo } from "../global-functions.js"


// Рендер всей навигации
export function renderNavigation() {
    let userData = getCache("userData")
    let userCountryData = getCache("userCountryData")
    
    $("main nav").html(
        `<div class="main-nav__phone">
            <!-- Кнопка профиля в топ навигации -->
            ${userData // Если есть информация о юзере
            ? `<button class="transparent" id="nav__profile">
                <img src="../assets/images/base/base-avatar.png" alt="avatar" id="nav__profile-image">
                <h5 class="text-cut" id="nav__profile-name">Имя</h5>
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
                    <img src="../assets/images/logo/main-logotype.png" alt="logotype">
                </div>
    
                <!-- Список всех ссылок -->
                <li>

                    <!-- Кнопка авторизации или профиль юзера -->
                    ${userData // Если есть информация о юзере
                    ? `<ul class="main-nav__link"><a href="#" id="nav-full__profile">
                            <img src="../assets/images/base/base-avatar.png" alt="avatar" id="nav-full__profile-image">
                            <div class="main-nav__link-text">
                                <h5 class="text-cut" id="nav-full__profile-name">Имя</h5>
                                <h6 class="text-cut" id="nav-full__profile-tag">@tag123456</h6>
                            </div>
                        </a></ul>`
                    : `<ul class="main-nav__link"><a href="../login/" id="nav-full__authorization">Авторизация</a></ul>` // Иначе кнопка входа
                    }
    
                    <!-- Кнопка страны (Если у юзера она есть) -->
                    ${userCountryData // Если есть информация о стране юзере
                    ? `<ul class="main-nav__link"><a href="#" id="nav-full__country">
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
                    <ul class="main-nav__link"><a href="../home/">Главная</a></ul>
                    <ul class="main-nav__link"><a href="#">Новости</a></ul>
                    <ul class="main-nav__link"><a href="#">Участники</a></ul>
                    <ul class="main-nav__link"><a href="#">Нации</a></ul>
                    <ul class="main-nav__link"><a href="#">Страны</a></ul>
                    <div class="main-nav__divider"></div>
                    <ul class="main-nav__link"><a href="../admin/">Помощь</a></ul>
                    <ul class="main-nav__link"><a href="#">О нас</a></ul>
                </li>
            </div>
        </div>`
    )


    // Нажатие логотип - переход на вкладку дом
    $("#nav__logo img").on("click tap", () => { 
        linkTo("../home/")
    })
    
    // Открытие навигации
    $("#nav__burger").on("click tap", () => { 
        $(".main-nav__content-wrapper").toggleClass("show");
        $(".main-nav__content").toggleClass("show");
        $(".main-nav__phone").toggleClass("hide-border-part");
        $("#nav__burger").toggleClass("clicked");
    })

    $("#nav-full__profile").on("click tap", function () {
        console.log(1);
    });
}

renderNavigation() // Рендерим сразу