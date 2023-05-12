import {sendGSRequest, sendVkRequest, setInputError, createNotification, setButtonDisabled, logger, sendError} from "../global/scripts-base.js"
// localStorage.removeItem("userData")

// localStorage userData, userNations, userSelectedNation
let userData = JSON.parse(localStorage.getItem("userData"))
let authorized = userData ? true : false

if (!authorized) { // Если не авторизован то выкидывает сразу
    location.href = "../authorization/index.html"
}

let userCountry = {}
try { // Пробуем получить страну пользователя, если не удается спарсить то удаляем
    userCountry = JSON.parse(localStorage.getItem("userCountry"))
} catch {
    logger("[-] Error in userCountry, deleting...")
    localStorage.removeItem("userCountry")
}

let logoReady = false
let mapReady = false
let editingType = "main-edit"
let editingCountry = null // Информация о изменяемой стране
let selfCountryEdit = false // Изменяелся ли страна юзера


// http://127.0.0.1:5500/county-edit/index.html?id=11231234
let urlParams = new URLSearchParams(location.search)
let params = {}
urlParams.forEach((e, key) => {
    params[key] = e
})


try {
    if ("id" in params) { // Если указан id
        $(".editing-nav").removeClass("hide-block") // Удаляем скрытие
        $(".country-id").text(params.id) // id страны

        if (params.id === userData.about.сountry) { // Юзер изменяет свою страну
            selfCountryEdit = true // Изменение своей
            
            if (userCountry) { // Если информация загружена - рендер + обновление
                logger("[R] Render self country by id", params.id)
                editingCountry = userCountry // Инфу из хеша
                fillingInfo(userCountry) // Заполняем информацией их хеша

                sendGSRequest("countries", "getDataById", {id: userData.about.сountry}, (data) => {
                    logger("[+] Received userCountry")

                    editingCountry = data
                    fillingInfo(editingCountry) // Заполняем поля новой информацией
                    localStorage.setItem("userCountry", JSON.stringify(editingCountry)) // Обновляем информацию о стране юзера
                })
            } else { // Если информации нету, то загрузка
                logger("[R] Render self country by id", params.id, "preload...")
                $(".waiting").addClass("waiting-show") // Ставим загрузку

                sendGSRequest("countries", "getDataById", {id: userData.about.сountry}, (data) => {
                    logger("[+] Received userCountry")

                    editingCountry = data
                    fillingInfo(editingCountry) // Заполняем поля новой информацией
                    $(".waiting").removeClass("waiting-show") // Удаляем загрузку
                    localStorage.setItem("userCountry", JSON.stringify(editingCountry)) // Обновляем информацию о стране юзера
                })
            }
        } else { // Изменение другой страны (по доступности)
            // Загрузка + проверка на доступность
            logger("[R] Render another country by id", params.id)
            sendGSRequest("countries", "getDataById", {id: params.id}, (data) => {
                if (data) { // Если страна существует
                    logger("[+] Received editingCountry")

                    editingCountry = data
                } else { // Если нет то ошибка
                    logger("[-] Incorrect id")
                    alert(`Не удалось отобразить страницу редактирования страну, причина в несуществующем id!\nIncorrect id`)
                    location.href = "../home/index.html"
                }
            })
        }

    } else { // Если не указан id
        selfCountryEdit = true // Изменение своей

        if (userData.about.сountry) { // Изменение своей страны по ссылке без id или создание
            $(".editing-nav").removeClass("hide-block") // Удаляем скрытие
            $(".country-id").text(userData.about.сountry) // id страны

            if (userCountry) { // Если информация загружена - рендер + обновление
                logger("[R] Render self country")
                editingCountry = userCountry // Инфу из хеша
                fillingInfo(userCountry) // Заполняем информацией их хеша

                sendGSRequest("countries", "getDataById", {id: userData.about.сountry}, (data) => {
                    logger("[+] Received userCountry")

                    editingCountry = data
                    fillingInfo(editingCountry) // Заполняем поля новой информацией
                    localStorage.setItem("userCountry", JSON.stringify(editingCountry)) // Обновляем информацию о стране юзера
                })
            } else { // Если информации нету, то загрузка
                logger("[R] Render self country, preload")
                $(".waiting").addClass("waiting-show") // Ставим загрузку

                sendGSRequest("countries", "getDataById", {id: userData.about.сountry}, (data) => {
                    logger("[+] Received userCountry")

                    editingCountry = data
                    fillingInfo(editingCountry) // Заполняем поля новой информацией
                    $(".waiting").removeClass("waiting-show") // Удаляем загрузку
                    localStorage.setItem("userCountry", JSON.stringify(editingCountry)) // Обновляем информацию о стране юзера
                })
            }

        } else { // Если нету страны - создание
            logger("[R] Creating country")

            editingType = "main-create" // Меняем изменеие на создание
            $(".country-id").text(userData.id) // Потому что id страны - id юзера
            $(".edit-save").text("Создать") // Меняем название кнопки с сохранить на создать
            $(".editing-nav").remove() // Удаляем навигацию
            // удалить другие блоки
            
        }
    }
} catch(error) {
    sendError("Не удалось отобразить страницу редактирования страны!", userData, error)
}

function fillingInfo(countryInfo) { // Заполение
    $(".country-title").val(countryInfo.name);
    $(".country-about").val(countryInfo.about);
    $(".country-logo").val(countryInfo.logo);
    $(".country-map").val(countryInfo.map);

    $(".country-logo").trigger("change") // Триггер картинки
    $(".country-map").trigger("change") // Триггер картинки
}


// Главная форма
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

    let countryLogo = ""
    if (formLogo === "") { // Если картинки нет то ставим по умолчанию и пропускам
        countryLogo = "https://sun9-67.userapi.com/impg/X1_O1m3fnSygoDxCy1F0E2XwkkVM3gnJoyq9Ag/ka6WlHoJtSE.jpg?size=1200x800&quality=96&sign=61dccb30475f6dce4315c03fb9fc3480&type=album"
    } else {
        if (!logoReady) { // Если картинка указана но не загрузилась то отмена
            return
        }
        countryLogo = formLogo
    }

    let countryMap = ""
    if (formMap === "") { // Если картинки нет то ставим по умолчанию и пропускам
        countryMap = "https://sun9-69.userapi.com/impg/PwwEhaHUdBalSlBmZF3R9jwpXKj-Zc7sRXlwCw/U8T8wo7H2b8.jpg?size=1600x1476&quality=96&sign=7635ccb95d5fc12964c44716b517f407&type=album"
    } else {
        if (!mapReady) { // Если картинка указана но не загрузилась то отмена
            return
        }
        countryMap = formMap
    }


    $(".waiting").addClass("waiting-show")
    
    if (editingType === "main-edit") { // Изменение
        editingCountry.name = formTitle
        editingCountry.about = formAbout
        editingCountry.logo = countryLogo
        editingCountry.map = countryMap

        sendGSRequest("countries", "updateDataById", editingCountry, (data) => { // Сохраняем
            if (selfCountryEdit) { // Сохраняем только если юзер изменил свою страну
                localStorage.setItem("userCountry", JSON.stringify(editingCountry)) // Обновляем информацию о стране
            }
            
            let message = `Изменена страна:\nПользователь: ${userData.vkName} (${userData.id})\nСтрана: ${editingCountry.name} (${editingCountry.id})`
            sendVkRequest('messages.send', {peer_id: 2000000007, random_id: 0, message: message}, 
                (data) => {
                    if (data.response) { // success
                        location.href = "../country/index.html?id=" + userCountry.id
                    }
                }
            )
        })
    } else { // Создание
        try {
            sendGSRequest("countries", "getData", {}, (data) => {
                let date = Date.now()
                let newCountry = {
                    id: userData.id, // id равен id юзера
                    owner: userData.id, // id Владельца
                    creationDate: date, // Дата создания страны
                    name: formTitle, // Название страны
                    about: formAbout, // Описание страны
                    members: {},
                    nations: {},
                    logo: formMap !== "" ? formMap : "https://sun9-67.userapi.com/impg/X1_O1m3fnSygoDxCy1F0E2XwkkVM3gnJoyq9Ag/ka6WlHoJtSE.jpg?size=1200x800&quality=96&sign=61dccb30475f6dce4315c03fb9fc3480&type=album", // Логотип
                    map: formMap !== "" ? formLogo : "https://sun9-69.userapi.com/impg/PwwEhaHUdBalSlBmZF3R9jwpXKj-Zc7sRXlwCw/U8T8wo7H2b8.jpg?size=1600x1476&quality=96&sign=7635ccb95d5fc12964c44716b517f407&type=album", // Карта
                }

                newCountry.members[userData.id] = { // Пушим юзера
                    id: userData.id,
                    role: "Президент",
                    access: "owner"
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
            })
        } catch(error) {
            sendError("Произошла непредвиденная ошибка при изменени/создании страны!", userData, error)
        }
    }
})

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