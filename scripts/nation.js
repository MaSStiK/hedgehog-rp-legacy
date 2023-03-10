import {sendGSRequest, sendVkRequest, setInputError, createNotification, setBlockWaiting, setButtonDisabled} from "./scripts-base.js"
// localStorage.removeItem("userData")

// localStorage userData, allUsers, allNations
let userData = JSON.parse(localStorage.getItem("userData"))
let allUsers = JSON.parse(localStorage.getItem("allUsers"))
let allNations = JSON.parse(localStorage.getItem("allNations"))
let authorized = userData ? true : false
let nationReady = false
let nowEditing = ""
let nowEntering = ""
let userNationsCount = 0
const maxUserNationCount = 10

// http://127.0.0.1:5500/nations.html?search=Олег%20петров
let urlParams = new URLSearchParams(location.search)
let params = {}
urlParams.forEach((e, key) => {
    params[key] = e
})

function renderNations(allNations, finalRender) {
    $(".nation-container").remove()
    Object.keys(allNations).reverse().forEach((nationId) => {
        let nationAbout = "Описание не указано"
        if (allNations[nationId].about !== "") {
            nationAbout = allNations[nationId].about
        }
        let ownerId = allNations[nationId].ownerId
        let nationBlock = `
        <div class="block nation-container nation-${allNations[nationId].id}">
            <div class="nation">
                <div class="nation__image" style="background-image: url(${allNations[nationId].image});"></div>
                <div class="nation__content">
                    <p class="h1-title primary-text nation__content-title">${allNations[nationId].name}</p>
                    <p class="h3-little-break secondary-text nation__content-text">${nationAbout}</p>
                </div>
                <div class="nation__after">
                    <a href="./profile.html?id=${ownerId}" class="nation__after-profile">
                        <div class="nation__after-avatar" style="background-image: url(${allUsers[ownerId].avatar});"></div>
                        <div class="nation__after-names">
                            <p class="h2-normal primary-text nation__after-name">${allUsers[ownerId].name} ${allUsers[ownerId].surname}</p>
                            <p class="h3-little-break secondary-text">Автор</p>
                        </div>
                    </a>
                    <div class="nation__after-buttons buttons-${allNations[nationId].id}" >
                        <div class="nation__after-buttons-wrapper nation__after-button-share share-${allNations[nationId].id}">
                            <img src="./assets/Share.svg" alt="share">
                        </div>
                        <div class="nation__after-buttons-wrapper nation__after-button-enter enter-${allNations[nationId].id}">
                            <img src="./assets/Enter.svg" alt="enter">
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>`
        $(".nations__all").append(nationBlock) // Добовляем блок во все

        let editButton = `
        <div class="nation__after-buttons-wrapper nation__after-button-edit edit-${allNations[nationId].id}" id="${allNations[nationId].id}">
            <img src="./assets/Edit.svg" alt="edit">
        </div>`
        
        if (authorized) { // Если аавторизованный пользователь
            if (allNations[nationId].ownerId === userData.id) { // Нации пользователя
                $(".nations__user").append(nationBlock) // Добовляем блок в нации пользователя
                if (finalRender) { // Окончательный рендер
                    $(`.buttons-${allNations[nationId].id}`).append(editButton) // Добовляем кнопку редактирования для блока в обеих колоннах
                    userNationsCount++ // Добовляем в колличество стран пользователя
                }
            }

            $(`.edit-${allNations[nationId].id}`).on("click tap", (event) => {
                event.stopPropagation() // Остановка всплытия
                let targetId = $(event.target).parent().attr('id') // Клик на картинку - костыль
                if (!targetId) {
                    targetId = $(event.target).attr('id') // Клик по обвертке
                }
                if (allNations[targetId].ownerId === userData.id) {
                    $(".create-modal__block-button-save").css("display", "none") // Кнопка сохранить выкдючается если изменение
                    $(".create-modal__block-button-change").css("display", "flex") // Кнопка изменить включается
                    $(".create-modal__block-button-delete").css("display", "flex") // Кнопка удалить включается
                    $(".create-modal__block-button-confirm").css("display", "none") // Кнопка подтвердить удаление выключается
                    $(".create-modal__block-title").text("Изменение нации") // Измение заголовка
                    $(".create-modal__block-name").val(allNations[targetId].name)
                    $(".create-modal__block-textarea").val(allNations[targetId].about)
                    $(".create-modal__block-image").val(allNations[targetId].image)
                    $(".create-modal__block-image").trigger("change");
                    $(".create-modal__wrapper").css("display", "flex")
                    nowEditing = targetId
                }
            })
        }

        $(`.share-${allNations[nationId].id}`).on("click tap", (event) => {
            event.stopPropagation() // Остановка всплытия
            try {
                navigator.clipboard.writeText(`${location.origin}${location.pathname}?search=${allNations[nationId].name.replace(" ", "%20")}`)
                createNotification("Ссылка на нацию скопирована!")
            } catch {
                createNotification("Не удалось скопировать!", "danger")
            }
        })
        
        if (finalRender) {
            $(".nation__after-button-share").css("display", "flex");
            $(".nation__after-button-enter").css("display", "flex");
        }

        $(`.enter-${allNations[nationId].id}`).on("click tap", (event) => {
            event.stopPropagation() // Остановка всплытия
            if (authorized) { // Если авторизован
                nowEntering = allNations[nationId].id
                $(".enter-modal__block-text").text(`Вы уверены что хотите присоединиться к нации "${allNations[nationId].name}"?`);
                $(".enter-modal__wrapper").css("display", "flex")
            } else { // Если нет то выкидвает на вход
                location.href = "./authorization.html"
                return
            }            
        })

        $(`.nations__all .nation-${allNations[nationId].id}`).on("click tap", () => { // Открытие отдельно столбец все
            $(`.nations__all .nation-${allNations[nationId].id}`).toggleClass("nation-opened");
            $(`.nations__all .nation-${allNations[nationId].id} .nation .nation__content .nation__content-title`).toggleClass("nation-opened-title");
            $(`.nations__all .nation-${allNations[nationId].id} .nation .nation__content .nation__content-text`).toggleClass("nation-opened-text");
        })

        $(`.nations__user .nation-${allNations[nationId].id}`).on("click tap", () => { // Открытие отдельно столбец юзера
            $(`.nations__user .nation-${allNations[nationId].id}`).toggleClass("nation-opened");
            $(`.nations__user .nation-${allNations[nationId].id} .nation .nation__content .nation__content-title`).toggleClass("nation-opened-title");
            $(`.nations__user .nation-${allNations[nationId].id} .nation .nation__content .nation__content-text`).toggleClass("nation-opened-text");
        })
    })
}

$(".create-modal__block-button-change").on("click tap", () => { // Кнопка изменения
    setButtonDisabled(".create-modal__block-button-change")
    if ($(".create-modal__block-name").val() === "") {
        setInputError(".create-modal__block-name")
        return
    }

    let newNationImage = ""
    if ($(".create-modal__block-image").val() === "") { // Если картинки нет то ставим по умолчанию и пропускам
        newNationImage = "https://sun9-49.userapi.com/impg/Xgaf618IwpL2I35TFJpVBPLt9Dvkewqgaft8bw/DgS5wvgGFbw.jpg?size=1024x1024&quality=96&sign=5ee37411a11ea01416bba21571b116da&type=album"
    } else {
        if (!nationReady) { // Если картинка указана но не загрузилась то отмена
            return
        }
        newNationImage = $(".create-modal__block-image").val()
    }

    try {
        $(".create-waiting").addClass("create-waiting-show")
        let newNationName = $(".create-modal__block-name").val()
        let nationData = allNations[nowEditing]
        if (newNationName.toLowerCase() !== nationData.name.toLowerCase()) { // Если новое имя не совпадает со старым то проверяем новое имя на уникальность
            sendGSRequest("nations", "getData", {}, (data) => {
                let saveChange = true // Костыль не трогать
                Object.keys(data).forEach((natId) => {
                    if (data[natId].name.toLowerCase() === newNationName.toLowerCase()) { // Если найдено идентичное название то ошибка
                        setInputError(".create-modal__block-name")
                        $(".create-waiting").removeClass("create-waiting-show")
                        saveChange = false
                    }
                })
                if (saveChange) {
                    let oldNationName = nationData.name
                    nationData.name = newNationName // Новое имя после проверки
                    nationData.about = $(".create-modal__block-textarea").val() // Описание без проверок
                    nationData.image = newNationImage // Новая аватарка после проверки
                    sendGSRequest("nations", "updateDataById", nationData, (data) => { // Сохраняем 
                        let message = `Обновлена нация:\nПользователь: ${userData.name} ${userData.surname} (${userData.id})\nНация: ${oldNationName} > ${newNationName} (${nationData.id})`
                        sendVkRequest('messages.send', {peer_id: 2000000007, random_id: 0, message: message}, 
                            (data) => {
                                if (data.response) { // success
                                    location.reload()
                                }
                            }
                        )
                    })
                }
            })
        } else { // Если имя старое то просто сохраняем изменения
            nationData.about = $(".create-modal__block-textarea").val() // Описание без проверок
            nationData.image = newNationImage // Новая аватарка после проверки
            sendGSRequest("nations", "updateDataById", nationData, (data) => { // Сохраняем 
                let message = `Обновлена нация:\nПользователь: ${userData.name} ${userData.surname} (${userData.id})\nНация: (${nationData.id})`
                sendVkRequest('messages.send', {peer_id: 2000000007, random_id: 0, message: message}, 
                    (data) => {
                        if (data.response) { // success
                            location.reload()
                        }
                    }
                )
            })
        }
    } catch(error) {
        alert(`Произошла непредвиденная ошибка при изменении расы!\nОтправьте эту ошибку разработчику https://vk.com/291195777\n${error}`)
        location.reload()
    }
})

$(".create-modal__block-button-delete").on("click tap", () => { // Кнопка удалить нацию меняется на подтверждение удаления
    $(".create-modal__block-button-delete").css("display", "none")
    $(".create-modal__block-button-confirm").css("display", "flex")
})

$(".create-modal__block-button-confirm").on("click tap", () => { // Подтверждение удаления
    setButtonDisabled(".create-modal__block-button-confirm")
    let nationData = allNations[nowEditing]
    if (nationData.ownerId === userData.id) {
        $(".create-waiting").addClass("create-waiting-show")
        sendGSRequest("nations", "deleteRowById", nationData, (data) => {
            let message = `Удалена нация:\nПользователь: ${userData.name} ${userData.surname} (${userData.id})\nНация: ${nationData.name} (${nationData.id})`
            sendVkRequest('messages.send', {peer_id: 2000000007, random_id: 0, message: message}, 
                (data) => {
                    if (data.response) { // success
                        location.reload()
                    }
                }
            )
        })
    }
})

if (authorized) { // Если авторизован то добовляет кнопку для создания
    $(".nations__all-wrapper").after(`
    <div class="nations__user-wrapper">
        <div class="nations__user-title-wrapper">
            <p class="big-title secondary-text nations__user-change-all">Все нации</p>
            <p class="big-title primary-text nations__user-title">Мои нации</p>
        </div>
        <div class="nations__user">
            
        </div>
    </div>`) // Добовляем нации пользователя
    $(".bottom__find").after(`<button class="primary-button create-nation" disabled>Создать нацию 0/${maxUserNationCount}</button>`)
    // $(".create-nation").attr("disabled", "disabled")

    $(".create-nation").on("click tap", () => {
        $(".create-modal__block-button-save").css("display", "flex") // Кнопка сохранить если создание
        $(".create-modal__block-button-change").css("display", "none") // Кнопка изменить выключается
        $(".create-modal__block-button-delete").css("display", "none") // Кнопка удалить выключается
        $(".create-modal__block-button-confirm").css("display", "none") // Кнопка подтвердить удаление выключается
        $(".create-modal__block-title").text("Создание нации") // Измение заголовка
        $(".create-modal__block-name").val("")
        $(".create-modal__block-textarea").val("")
        $(".create-modal__block-image").val("")
        $(".nation-preview").remove()
        $(".create-modal__wrapper").css("display", "flex")
    })
    
    $(".create-modal__block-button-cancel").on("click tap", () => {
        $(".create-modal__wrapper").css("display", "none")
    })

    $(".create-modal__block-button-save").on("click tap", () => {
        setButtonDisabled(".create-modal__block-button-save")
        if ($(".create-modal__block-name").val() === "") {
            setInputError(".create-modal__block-name")
            return
        }

        let nationImage = ""
        if ($(".create-modal__block-image").val() === "") { // Если картинки нет то ставим по умолчанию и пропускам
            nationImage = "https://sun9-49.userapi.com/impg/Xgaf618IwpL2I35TFJpVBPLt9Dvkewqgaft8bw/DgS5wvgGFbw.jpg?size=1024x1024&quality=96&sign=5ee37411a11ea01416bba21571b116da&type=album"
        } else {
            if (!nationReady) { // Если картинка указана но не загрузилась то отмена
                return
            }
            nationImage = $(".create-modal__block-image").val()
        }

        try {
            $(".create-waiting").addClass("create-waiting-show")
            let nationName = $(".create-modal__block-name").val()
            sendGSRequest("nations", "getData", {}, (data) => {
                try {
                    let checkUserNationCount = 0
                    let saveNation = true // Костыль не трогать
                    Object.keys(data).forEach((nationId) => {
                        if (data[nationId].ownerId === userData.id) { // Проверка колличества наций юзера
                            checkUserNationCount++
                        }

                        if (data[nationId].name.toLowerCase() === nationName.toLowerCase()) { // Если найдено идентичное название то ошибка
                            setInputError(".create-modal__block-name")
                            $(".create-waiting").removeClass("create-waiting-show")
                            saveNation = false
                        }
                    })

                    if (checkUserNationCount >= maxUserNationCount) {
                        alert("Превышено колличество наций пользователя!")
                        location.reload()
                        return
                    }

                    if (checkUserNationCount < maxUserNationCount && saveNation) {
                        let id = Math.random().toString(36).slice(2)
                        let nationAbout = $(".create-modal__block-textarea").val()
                        let date = Date.now()
                        let ownerId = userData.id
                        let newNation = {
                            id: id, // Уникальный id
                            name: nationName, // Название
                            about: nationAbout,
                            creationDate: date,
                            ownerId: ownerId,
                            image: nationImage
                        }
                        sendGSRequest("nations", "addDataById", newNation, (data) => { // Сохраняем 
                            let message = `Создана нация:\nПользователь: ${userData.name} ${userData.surname} (${userData.id})\nНация: ${nationName} (${id})`
                            sendVkRequest('messages.send', {peer_id: 2000000007, random_id: 0, message: message}, 
                                (data) => {
                                    if (data.response) { // success
                                        location.reload()
                                    }
                                }
                            )
                        })
                    }
                    
                } catch(error) {
                    alert(`Произошла непредвиденная ошибка на стадии сохранения расы!\nОтправьте эту ошибку разработчику https://vk.com/291195777\n${error}`)
                    location.reload()
                }
            })
        } catch(error) {
            alert(`Произошла непредвиденная ошибка на стадии создания расы!\nОтправьте эту ошибку разработчику https://vk.com/291195777\n${error}`)
            location.reload()
        }
    })  
}

$(".nations__all-change-user").on("click tap", () => { // Смена вкладки на юзера
    if (authorized) { // Если авторизован то переключение вкладки
        $(".nations__all-wrapper").css("display", "none");
        $(".nations__user-wrapper").css("display", "flex");
    } else { // Если нет, то переброс на авторизацию
        location.href = "./authorization.html"
    }
})

$(".nations__user-change-all").on("click tap", () => { // Смена вкладки на все
    if (authorized) { // Если авторизован то переключение вкладки
        $(".nations__user-wrapper").css("display", "none");
        $(".nations__all-wrapper").css("display", "flex");
    } else { // Если нет, то переброс на авторизацию
        location.href = "./authorization.html"
    }
})

try {
    if (!allNations) { // Если все нации пустые сначало загружаем потом рендер
        sendGSRequest("users", "getData", {}, (data) => { // Загружаем всех юзеров
            localStorage.setItem("allUsers", JSON.stringify(data))
            allUsers = data
            sendGSRequest("nations", "getData", {}, (data) => { // Загружаем все нации
                renderNations(data, true)

                $(".create-nation").text(`Создать нацию ${userNationsCount}/${maxUserNationCount}`)
                if (userNationsCount < maxUserNationCount) { // Возможность добавить новую нацию если их меньше maxUserNationCount
                    $(".create-nation").removeAttr("disabled")
                }
                
                localStorage.setItem("allNations", JSON.stringify(data))
                allNations = data

                $(".bottom__find-input").trigger("input") // Поиск страны после рендера
            })
        })
        
    } else { // Сразу рендер, потом загружаем и сного рендерим
        renderNations(allNations, false) // Рендер из хеша
        sendGSRequest("users", "getData", {}, (data) => { // Загружаем всех юзеров
            localStorage.setItem("allUsers", JSON.stringify(data))
            allUsers = data
            sendGSRequest("nations", "getData", {}, (data) => { // Загружаем все нации
                renderNations(data, true)

                $(".create-nation").text(`Создать нацию ${userNationsCount}/${maxUserNationCount}`)
                if (userNationsCount < maxUserNationCount) { // Возможность добавить новую нацию если их меньше maxUserNationCount
                    $(".create-nation").removeAttr("disabled")
                }
                localStorage.setItem("allNations", JSON.stringify(data))
                allNations = data

                $(".bottom__find-input").trigger("input") // Поиск страны после рендера
            })
        })
    }
} catch(error) {
    alert(`Не удалось отобразить страницу наций!\nОтправьте эту ошибку разработчику https://vk.com/291195777\n${error}`)
    // location.href = "./index.html"
    location.reload()
}

$(".create-modal__block-image").change(() => { // Превью картинки нации
    $(".nation-preview").remove()
    nationReady = false
    let img = new Image()
    img.src = $(".create-modal__block-image").val()
    img.onload = () => {
        nationReady = true
        $(".create-modal__block-image").after(`<div class="nation-preview"></div>`)
        $(".nation-preview").css("background-image", `url(${$(".create-modal__block-image").val()})`)
    }
    img.onerror = () => {
        nationReady = false
        setInputError(".create-modal__block-image")
    }
})

$(".create-modal__block-name").on("change", () => { // Удаление лишних пробелов из названия нации
    $(".create-modal__block-name").val($(".create-modal__block-name").val().replace(/ +/g, ' ').trim())
})

$(".bottom__find-input").on("input", () => { // Кнопка поиска
    if ($(".bottom__find-input").val() === "") {
        $(".nations__all .nation-container").css("display", "block")
    } else {
        $(".nations__all .nation-container").css("display", "none")
        $(".nations__all .nation-container").each((i, element) => { 
            if ($(element).find(".nation__content-title").text().toLowerCase().includes($(".bottom__find-input").val().toLowerCase())) {
                $(element).css("display", "block")
            }

            if ($(element).find(".nation__content-text").text().toLowerCase().includes($(".bottom__find-input").val().toLowerCase())) {
                $(element).css("display", "block")
            }

            if ($(element).find(".nation__after-name").text().toLowerCase().includes($(".bottom__find-input").val().toLowerCase())) {
                $(element).css("display", "block")
            }
        })
    }
})

if ("search" in params) { // Поиск страны после рендера
    $(".bottom__find-input").val(params.search)
    $(".bottom__find-input").trigger("input")
}

$(".enter-modal__block-button-cancel").on("click tap", () => {
    $(".enter-modal__wrapper").css("display", "none")
})

$(".enter-modal__block-button-change").on("click tap", () => {
    userData.about.nation = nowEntering.toString()
    setButtonDisabled(".enter-modal__block-button-change")
    $(".create-waiting").addClass("create-waiting-show")
    sendGSRequest("users", "updateDataById", userData, (data) => {
        localStorage.setItem("userData", JSON.stringify(userData))
        location.reload()
    })
})