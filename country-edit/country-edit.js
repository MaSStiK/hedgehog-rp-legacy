import {sendGSRequest, sendVkRequest, setInputError, createNotification, setButtonDisabled, logger, sendError} from "../global/scripts-base.js"
// localStorage.removeItem("userData")

// localStorage userData, userNations, userSelectedNation
let userData = JSON.parse(localStorage.getItem("userData"))
let authorized = userData ? true : false

let userCountry = {}
try { // Пробуем получить нации пользователя, если не удается спарсить то удаляем
    userCountry = JSON.parse(localStorage.getItem("userCountry"))
} catch {
    logger("[-] Error in userCountry, deleting...")
    localStorage.removeItem("userCountry")
}
console.log(userCountry);
let logoReady = false
let mapReady = false

if (!authorized) { // Если не авторизован то выкидывает сразу
    location.href = "../authorization/index.html"
}

// http://127.0.0.1:5500/county-edit/index.html?id=11231234
let urlParams = new URLSearchParams(location.search)
let params = {}
urlParams.forEach((e, key) => {
    params[key] = e
})

try {
    if ("id" in params) { // Если указан id
        $(".editing-nav").removeClass("hide-block") // Удаляем скрытие

    } else { // Если не указан id
        if (authorized) { // но авторизован, рендер своей страны
            if (userData.about.сountry) { // Изменение своей страны
                $(".editing-nav").removeClass("hide-block") // Удаляем скрытие

            } else { // Если нету страны - создание
                $(".country-id").text(userData.id) // Потому что id страны - id юзера
                $(".edit-save").text("Создать") // Меняем название кнопки с сохранить на создать
                $(".editing-nav").remove() // Удаляем навигацию
                // удалить другие блоки
                
            }
        } else { // не авторизован то выкидвываем на авторизацию
            // Защита от дурака
            location.href = "../authorization/index.html"
        }
    }
} catch(error) {
    sendError("Не удалось отобразить страницу редактирования страны!", userData, error)
}

function autoComplete(userCountry) { // Заполение
    
    $(".country-id").text(userData.about.сountry) // id страны
    if (userCountry) {
        // Тут же заполение других вкладок
        $(".country-title").val(userCountry.name);
        $(".country-about").val(userCountry.about);
        $(".country-logo").val(userCountry.logo);
        $(".country-map").val(userCountry.map);
    }
    return
}



// -------------------------Мусор-------------------------



if (userData.about.сountry && !userCountry) { // Если нету информации о стране - загружаем
    // get data
    // autoComplete(userCountry)
}

if (userData.about.сountry !== "") { // Если у юзера есть страна
    autoComplete(userCountry) // Автозаполение сохраненной информации
} else { // Если нету страны
    
}

$(".editing-nav__back").on("click tap", () => { // Кнопка Вернуться, Если нету страны - возвращает в общий список иначе в страну пользователя
    if (userData.about.сountry !== "") {
        location.href = "../country/index.html?id=" + userData.id
    } else {
        location.href = "../countries/index.html"
    }
})

$(".edit-cancel").on("click tap", () => { // Кнопка Отмена, Если нету страны - возвращает в общий список иначе в страну пользователя
    if (userData.about.сountry !== "") { 
        location.href = "../country/index.html?id=" + userData.id
    } else {
        location.href = "../countries/index.html"
    }
})

$(".country-logo").change(() => { // Превью картинки
    $(".logo-preview").remove()
    logoReady = false
    let img = new Image()
    img.src = $(".country-logo").val()
    img.onload = () => {
        logoReady = true
        logger("[I] Logo loaded", logoReady)
        $(".country-logo").after(`<div class="block logo-preview"></div>`)
        $(".logo-preview").css("background-image", `url(${$(".country-logo").val()})`)
    }
    img.onerror = () => {
        logoReady = false
        logger("[I] Logo error", logoReady)
        setInputError(".country-logo")
    }
})

$(".country-map").change(() => { // Превью картинки
    $(".map-preview").remove()
    mapReady = false
    let img = new Image()
    img.src = $(".country-map").val()
    img.onload = () => {
        mapReady = true
        logger("[I] Map loaded", mapReady)
        $(".country-map").after(`<div class="block map-preview"></div>`)
        $(".map-preview").css("background-image", `url(${$(".country-map").val()})`)
    }
    img.onerror = () => {
        mapReady = false
        logger("[I] Map error", mapReady)
        setInputError(".country-map")
    }
})

// Форма входа
const mainForm = document.querySelector('.editing-main')
mainForm.addEventListener('submit', (event) => {
    event.preventDefault() // Отключение базового перехода
    setButtonDisabled(".edit-save")

    const formData = new FormData(mainForm)
    const formTitle = formData.get("title")
    const formAbout = formData.get("about")
    const formLogo = formData.get("logo")
    const formMap = formData.get("map")

    if (!formTitle) { // Если название пустое - ошибка
        setInputError(".country-title")
        return
    }

    if (!logoReady || !mapReady) { // Если картинка не загрузилась
        return
    }

    $(".waiting").addClass("waiting-show")

    try {
        sendGSRequest("countries", "getData", {}, (data) => {
            if (userData.about.сountry !== "") { // Если у человека уже есть страна - изменение
                userCountry = data[userData.about.сountry] // Новая инфа
                userCountry.name = formTitle
                userCountry.about = formAbout
                userCountry.logo = formMap !== "" ? formMap : "https://sun9-67.userapi.com/impg/X1_O1m3fnSygoDxCy1F0E2XwkkVM3gnJoyq9Ag/ka6WlHoJtSE.jpg?size=1200x800&quality=96&sign=61dccb30475f6dce4315c03fb9fc3480&type=album"
                userCountry.map = formMap !== "" ? formLogo : "https://sun9-69.userapi.com/impg/PwwEhaHUdBalSlBmZF3R9jwpXKj-Zc7sRXlwCw/U8T8wo7H2b8.jpg?size=1600x1476&quality=96&sign=7635ccb95d5fc12964c44716b517f407&type=album"
            
            } else { // Если нету страны - создание
                let date = Date.now()
                let newCountry = {
                    id: userData.id, // id равен id юзера
                    owner: userData.id, // id Владельца
                    creationDate: date, // Дата создания страны
                    name: formTitle, // Название страны
                    about: formAbout, // Описание страны
                    members: [
                        {
                            id: userData.id,
                            role: "Президент",
                            access: "owner"
                        }
                    ],
                    logo: formMap !== "" ? formMap : "https://sun9-67.userapi.com/impg/X1_O1m3fnSygoDxCy1F0E2XwkkVM3gnJoyq9Ag/ka6WlHoJtSE.jpg?size=1200x800&quality=96&sign=61dccb30475f6dce4315c03fb9fc3480&type=album", // Логотип
                    map: formMap !== "" ? formLogo : "https://sun9-69.userapi.com/impg/PwwEhaHUdBalSlBmZF3R9jwpXKj-Zc7sRXlwCw/U8T8wo7H2b8.jpg?size=1600x1476&quality=96&sign=7635ccb95d5fc12964c44716b517f407&type=album", // Карта
                }

                sendGSRequest("countries", "addDataById", newCountry, (data) => {
                    localStorage.setItem("userCountry", JSON.stringify(newCountry)) // Сохраняем страну пользователя
                    userData.about.сountry = userData.id
                    userData.about.сountryRole = "Президент"
                    sendGSRequest("users", "updateDataById", userData, (data) => { // Сохраняем
                        localStorage.setItem("userData", JSON.stringify(userData)) // Обновляем информацию о юзере
                        let message = `Создана страна:\nПользователь: ${userData.vkName} (${userData.id})\nСтрана: ${newCountry.name} (${newCountry.id})`
                        sendVkRequest('messages.send', {peer_id: 2000000007, random_id: 0, message: message}, 
                            (data) => {
                                if (data.response) { // success
                                    location.href = "../country/index.html?id=" + userData.id
                                }
                            }
                        )
                    })
                })
            }               
        })
    } catch(error) {
        sendError("Произошла непредвиденная ошибка при изменени/создании страны!", userData, error)
    }
})


if (userCountry) {
    // Триггер зарузки катинок
    $(".country-logo").trigger("change")
    $(".country-map").trigger("change")
}
