import {getData, updateData, createNotification, setInputError, sendVkRequest} from "./scripts-base.js"
// window.localStorage.removeItem("userData")

// localStorage userData, allUsers
let userData = JSON.parse(window.localStorage.getItem("userData"))
let allUsers = JSON.parse(window.localStorage.getItem("allUsers"))
let authorized = userData ? true : false

let userId = null
let nowEditing = ""
let avaReady = false

// http://127.0.0.1:5500/profile.html?id=MaSStiK&ids=MaSStiK
let urlParams = new URLSearchParams(window.location.search)
let params = {}
urlParams.forEach((e, key) => {
    params[key] = e
})

if (params.id) { // Если id указан в ссылке то генерируем его
    userId = params.id
} else if (authorized) { // Если id нету то генерируе профиль авторизовавшивося
    userId = userData.id
} else { // Переход на главную если нету id
    window.location.href = "./index.html"
}

function renderUser(userData) {
    $(".avatar-opened__img").attr("src", userData.avatar);
    $(".info-name").text(userData.name)
    $(".info-surname").text(userData.surname)
    $(".block-avatar__avatar").css("background-image", `url(${userData.avatar})`)
    $(".info-tag").text(userData.tag)
    if (userData.about.gameName !== "") {
        $(".info-gameName").text(userData.about.gameName)
    }
    let date = new Date(userData.about.rpDate).toLocaleString('ru', {timeZone: 'Europe/Moscow'})
    $(".info-rpDate").text(date.split(",")[0])
    if (userData.about.сountry !== "") {
        $(".info-сountry").text(`${userData.about.сountry} (${userData.about.сountryRole})`)
    }
    if (userData.about.race !== "") {
        $(".info-race").text(userData.about.race)
    }

    if (userData.about.languages !== "") {
        $(".info-languages").text(userData.about.languages)
    }

    if (userData.about.vkLink !== "") {
        $(".info-vkLink").text(userData.about.vkLink)
        $(".info-vkLink").removeClass("primary-text").addClass("link-text")
        $(".info-vkLink").unbind("click tap")
        $(".info-vkLink").on("click tap", () => {
            window.open(userData.about.vkLink, "_blank")
        })
    }

    if (userData.about.status !== "") {
        $(".info-status").text(userData.about.status)
    }
}

try {
    if (userData?.id === userId) { // Если профиль авторизованного то
        $(".block-avatar__avatar").after(`<button class="danger-button block-avatar__exit">Выйти</button>`)
        $(".edit-modal__block-button-report").css("display", "none")
        try {
            renderUser(userData) // Сначало рендерим из хэша
        } catch {}
        getData("users/" + userId, (data) => {
            renderUser(data) // Затем обновляем информацию о пользователе
            $(".block-info__button-edit").css("display", "flex") // Делаем кнопку редактирования профиля видимой
            $(".block-info__button-settings").css("display", "flex") // Делаем кнопку редактирования приватной информации видимой
            window.localStorage.setItem("userData", JSON.stringify(data))
        })
    } else {
        $(".block-avatar__avatar").after(`<button class="danger-button block-avatar__report">Пожаловаться</button>`)
        try {
            renderUser(allUsers[userId]) // Рендер из Хэша
        } catch {}        
        getData("users/", (data) => {
            renderUser(data[userId]) // Поиск человека и его рендер
            window.localStorage.setItem("allUsers", JSON.stringify(data))
        })
    }
} catch(error) {
    alert(`Не удалось создать страницу пользователя (${userId}), возможно причина в несуществующем id!\nОтправьте эту ошибку разработчику https://vk.com/291195777\n${error}`)
    window.location.href = "./index.html"
}

$(".block-info__button-edit").on("click tap", () => { // Эдит мод
    if (userData.id === userId) { // Если авторизованный изменяет свой профиль
        if ($(".block-info__button-edit").hasClass("edit-mode-on")) { // Если включен
            $(".block-info__button-edit").removeClass("edit-mode-on")
            $(".edit-name").remove()
            $(".edit-surname").remove()
            $(".edit-tag").remove()
            $(".edit-gameName").remove()
            $(".edit-rpDate").remove()
            $(".edit-сountry").remove()
            $(".edit-race").remove()
            $(".edit-languages").remove()
            $(".edit-vkLink").remove()
            $(".edit-status").remove()
            $(".edit-avatar").remove()
            $(".block-avatar__avatar-black").css("display", "none")
            $(".avatar-fullscreen__wrapper").css("display", "flex")
        } else {
            $(".block-info__button-edit").addClass("edit-mode-on")
            $(".info-name").after(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-name">`)
            $(".info-surname").after(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-surname">`)
            $(".info-tag").after(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-mode-little edit-tag">`)
            $(".info-gameName").after(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-gameName">`)
            $(".info-rpDate").after(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-rpDate">`)
            $(".info-сountry").after(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-сountry">`)
            $(".info-race").after(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-race">`)
            $(".info-languages").after(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-languages">`)
            $(".info-vkLink").after(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-vkLink">`)
            $(".block-info__status-wrapper").after(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-status">`)
            $(".avatar-fullscreen__wrapper").css("display", "none")
            $(".block-avatar__avatar-black").append(`<img src="./assets/Edit.svg" alt="edit" class="edit-mode edit-avatar">`)
            $(".block-avatar__avatar-black").css("display", "flex")
            
            $(".edit-name").on("click tap", () => {
                nowEditing = "name"
                $(".edit-modal__block-title").text(`Изменение поля "Имя"`)
                $(".edit-modal__block-text").text(`Введите новое значение:`)
                $(".edit-modal__block-help").css("display", "none")
                $(".edit-modal__block-help2").css("display", "block")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "1 - 16 символов")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 16)
                editInput.val("")
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    if (userData.id === userId) {
                        if (editInput.val() === "") {
                            setInputError(".edit-modal__block-input")
                        } else {
                            userData.name = $(".edit-modal__block-input").val()
                            updateData("users/" + userData.id, userData, (data) => {
                                window.localStorage.setItem("userData", JSON.stringify(userData))
                                $(".edit-modal__wrapper").css("display", "none")
                                location.reload()
                            })
                        }
                    }
                })
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-surname").on("click tap", () => {
                nowEditing = "surname"
                $(".edit-modal__block-title").text(`Изменение поля "Фамилия"`)
                $(".edit-modal__block-text").text(`Введите новое значение:`)
                $(".edit-modal__block-help").css("display", "none")
                $(".edit-modal__block-help2").css("display", "block")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "1 - 16 символов")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 16)
                editInput.val("")
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    if (userData.id === userId) {
                        if (editInput.val() === "") {
                            setInputError(".edit-modal__block-input")
                        } else {
                            userData.surname = $(".edit-modal__block-input").val()
                            updateData("users/" + userData.id, userData, (data) => {
                                window.localStorage.setItem("userData", JSON.stringify(userData))
                                $(".edit-modal__wrapper").css("display", "none")
                                location.reload()
                            })
                        }
                    }
                })
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-tag").on("click tap", () => {
                nowEditing = "tag"
                $(".edit-modal__block-title").text(`Изменение поля "Тег (uid)"`)
                $(".edit-modal__block-text").text(`Введите новое значение:`)
                $(".edit-modal__block-help").css("display", "none")
                $(".edit-modal__block-help2").css("display", "block")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "1 - 16 символов")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 16)
                editInput.val("")
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    if (userData.id === userId) {
                        if (editInput.val() === "") { // Если инпут пустой то просто ставим айдишник и сохраняем
                            userData.tag = "@" + userData.id
                            updateData("users/" + userData.id, userData, (data) => {
                                window.localStorage.setItem("userData", JSON.stringify(userData))
                                $(".edit-modal__wrapper").css("display", "none")
                                location.reload()
                            })
                        } else { // Если не пусто то проверяем на совпадение и потом сохраняем
                            let newTag = "@" + $(".edit-modal__block-input").val()
                            getData("users/", (data) => {
                                let pass = true
                                Object.keys(data).forEach((element) => {
                                    if (data[element].tag === newTag) { // Ищем совпадение
                                        if (data[element].id !== userData.id) { // Если это не uid этого пользователя
                                            pass = false
                                        }
                                    }
                                })

                                if (pass) { // Если uid уникальный то сохраняем
                                    userData.tag = newTag
                                    updateData("users/" + userData.id, userData, (data) => {
                                        window.localStorage.setItem("userData", JSON.stringify(userData))
                                        $(".edit-modal__wrapper").css("display", "none")
                                        location.reload()
                                    })
                                } else { // Если нет то ошибка
                                    setInputError(".edit-modal__block-input")
                                }
                            })
                        }
                    }
                })
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-gameName").on("click tap", () => {
                nowEditing = "gameName"
                $(".edit-modal__block-title").text(`Изменение поля "Игровое Имя"`)
                $(".edit-modal__block-text").text(`Введите новое значение:`)
                $(".edit-modal__block-help").css("display", "block")
                $(".edit-modal__block-help2").css("display", "none")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "1 - 48 символов")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 48)
                editInput.val("")
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    if (userData.id === userId) {
                        if (editInput.val() === "") { // Если инпут пустой то ставим имя фамилия 
                            userData.about.gameName = userData.name + " " + userData.surname
                        } else {
                            userData.about.gameName = $(".edit-modal__block-input").val()
                        }
                        updateData("users/" + userData.id, userData, (data) => {
                            window.localStorage.setItem("userData", JSON.stringify(userData))
                            $(".edit-modal__wrapper").css("display", "none")
                            location.reload()
                        })
                    }
                })
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-rpDate").on("click tap", () => {
                nowEditing = "rpDate"
                $(".edit-modal__block-title").text(`Изменение поля "Участник ЕРП с"`)
                $(".edit-modal__block-text").text(`Это поле может изменить только администратор! Напишите одному из них с просьбой указать вашу реальную дату появление в нашем проекте!`)
                $(".edit-modal__block-help").css("display", "none")
                $(".edit-modal__block-help2").css("display", "none")
                $(".edit-modal__block-input").css("display", "none")
                $(".edit-modal__block-button-linkout").css("display", "block")
                $(".edit-modal__block-button-linkout").unbind("click tap")
                $(".edit-modal__block-button-linkout").on("click tap", () => {
                    window.location.href = "./index.html" // Изменить ссылку на о нас (администрация)
                })
                $(".edit-modal__block-button-change").css("display", "none")
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-сountry").on("click tap", () => {
                nowEditing = "country"
                $(".edit-modal__block-title").text(`Изменение поля "Страна"`)
                $(".edit-modal__block-text").text(`Это поле заполнится автоматически когда вы создадите или присоединитесь к одной из стран!`)
                $(".edit-modal__block-help").css("display", "none")
                $(".edit-modal__block-help2").css("display", "none")
                $(".edit-modal__block-input").css("display", "none")
                $(".edit-modal__block-button-linkout").css("display", "block")
                $(".edit-modal__block-button-linkout").unbind("click tap")
                $(".edit-modal__block-button-linkout").on("click tap", () => {
                    window.location.href = "./index.html" // Изменить ссылку на страны
                })
                $(".edit-modal__block-button-change").css("display", "none")
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-race").on("click tap", () => {
                nowEditing = "race"
                $(".edit-modal__block-title").text(`Изменение поля "Раса"`)
                $(".edit-modal__block-text").text(`Это поле заполнится автоматически когда вы выбирите расу на специальной странице!`)
                $(".edit-modal__block-help").css("display", "none")
                $(".edit-modal__block-help2").css("display", "none")
                $(".edit-modal__block-input").css("display", "none")
                $(".edit-modal__block-button-linkout").css("display", "block")
                $(".edit-modal__block-button-linkout").unbind("click tap")
                $(".edit-modal__block-button-linkout").on("click tap", () => {
                    window.location.href = "./index.html" // Изменить на ссылку на расы
                })
                $(".edit-modal__block-button-change").css("display", "none")
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-languages").on("click tap", () => {
                nowEditing = "languages"
                $(".edit-modal__block-title").text(`Изменение поля "Язык(и)"`)
                $(".edit-modal__block-text").text(`Введите новое значение:`)
                $(".edit-modal__block-help").css("display", "block")
                $(".edit-modal__block-help2").css("display", "none")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "1 - 48 символов")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 48)
                editInput.val("")
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    if (userData.id === userId) {
                        userData.about.languages = $(".edit-modal__block-input").val()
                        updateData("users/" + userData.id, userData, (data) => {
                            window.localStorage.setItem("userData", JSON.stringify(userData))
                            $(".edit-modal__wrapper").css("display", "none")
                            location.reload()
                        })
                    }
                })
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-vkLink").on("click tap", () => {
                nowEditing = "vkLink"
                $(".edit-modal__block-title").text(`Изменение поля "Профиль ВК"`)
                $(".edit-modal__block-text").text(`Введите новое значение:`)
                $(".edit-modal__block-help").css("display", "block")
                $(".edit-modal__block-help2").css("display", "none")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "1 - 48 символов")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 48)
                editInput.val("")
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    if (userData.id === userId) {
                        userData.about.vkLink = $(".edit-modal__block-input").val()
                        updateData("users/" + userData.id, userData, (data) => {
                            window.localStorage.setItem("userData", JSON.stringify(userData))
                            $(".edit-modal__wrapper").css("display", "none")
                            location.reload()
                        })
                    }
                })
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-status").on("click tap", () => {
                nowEditing = "status"
                $(".edit-modal__block-title").text(`Изменение поля "Статус"`)
                $(".edit-modal__block-text").text(`Введите новое значение:`)
                $(".edit-modal__block-help").css("display", "block")
                $(".edit-modal__block-help2").css("display", "none")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "1 - 100 символов")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 100)
                editInput.val("")
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    if (userData.id === userId) {
                        userData.about.status = $(".edit-modal__block-input").val()
                        updateData("users/" + userData.id, userData, (data) => {
                            window.localStorage.setItem("userData", JSON.stringify(userData))
                            $(".edit-modal__wrapper").css("display", "none")
                            location.reload()
                        })
                    }
                })
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-avatar").on("click tap", () => {
                nowEditing = "avatar"
                $(".edit-modal__block-title").text(`Изменение поля "Фото профиля"`)
                $(".edit-modal__block-text").text(`Введите новое значение:`)
                $(".edit-modal__block-help").css("display", "block")
                $(".edit-modal__block-help2").css("display", "none")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "Ссылка на картинку")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 1000)
                editInput.val("")
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    if (userData.id === userId) {
                        if ($(".edit-modal__block-input").val() === "") { // Если пусто то стаим фотографию по умолчанию
                            userData.avatar = "../assets/avatars/coolHedgehog.png"
                            updateData("users/" + userData.id, userData, (data) => {
                                window.localStorage.setItem("userData", JSON.stringify(userData))
                                $(".edit-modal__wrapper").css("display", "none")
                                location.reload()
                            })
                        } else { // Если не пусто то проверяем фотографию
                            if (avaReady) {
                                userData.avatar = $(".edit-modal__block-input").val()
                                updateData("users/" + userData.id, userData, (data) => {
                                    window.localStorage.setItem("userData", JSON.stringify(userData))
                                    $(".edit-modal__wrapper").css("display", "none")
                                    location.reload()
                                })
                            } else {
                                setInputError(".edit-modal__block-input")
                            }
                        }
                    }
                })
                $(".edit-modal__wrapper").css("display", "flex")
            })
        }
    }
})

$(".block-info__button-settings").on("click tap", () => { // Переход в редактирование приватной информации
    window.location.href = "./settings.html"
})

$(".edit-modal__block-button-cancel").on("click tap", () => { // Отмена на модальном окне
    $(".avatar-preview").remove()
    $(".edit-modal__wrapper").css("display", "none")
})

$(".edit-modal__block-input").change(() => { // Свободный текст (удаление лишних пробелов)
    if (nowEditing === "gameName") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().replace(/ +/g, ' ').trim())
    }
    if (nowEditing === "languages") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().replace(/ +/g, ' ').trim())
    }
    if (nowEditing === "vkLink") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().replace(/ +/g, ' ').trim())
    }
    if (nowEditing === "status") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().replace(/ +/g, ' ').trim())
    }
    if (nowEditing === "avatar") {
        $(".avatar-preview").remove()
        avaReady = false
        let img = new Image()
        img.src = $(".edit-modal__block-input").val()
        img.onload = () => {
            avaReady = true
            $(".edit-modal__block-input").after(`<div class="avatar-preview"></div>`)
            $(".avatar-preview").css("background-image", `url(${$(".edit-modal__block-input").val()})`)
        }
        img.onerror = () => {
            avaReady = false
            setInputError(".edit-modal__block-input")
        }
    }
    if (nowEditing === "report") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().replace(/ +/g, ' ').trim())
    }
})

$(".edit-modal__block-input").on("input", () => { // Текст без пробелов
    if (nowEditing === "name") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().split(' ').join('_'))
    }
    if (nowEditing === "surname") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().split(' ').join('_'))
    }
    if (nowEditing === "tag") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().split(' ').join('_'))
    }
})

$(".block-info__button-share").on("click tap", () => { // Скопировать ссылку на профиль
    try {
        navigator.clipboard.writeText(window.location)
        createNotification("Ссылка на профиль скопирована!")
    } catch {
        createNotification("Не удалось скопировать!", "danger")
    }
})

$(".avatar-fullscreen").on("click tap", () => { // Открать аватарке фулскрин
    $(".avatar-opened").css("display", "flex")
})

$(".avatar-opened__close").on("click tap", () => { // Закрыть аватарку
    $(".avatar-opened").css("display", "none")
})

$(".block-avatar__exit").on("click tap", () => {
    window.localStorage.removeItem("userData")
    window.location.href = "./index.html"
})

$(".block-avatar__report").on("click tap", () => {
    if (!authorized) {
        createNotification("Жалобу может оставить только авторизованный пользователь!", "danger")
        return
    }
    nowEditing = "report"
    $(".edit-modal__block-title").text(`Создание жалобы`)
    $(".edit-modal__block-text").text(`Введите текст жалобы:`)
    $(".edit-modal__block-help").css("display", "none")
    $(".edit-modal__block-help2").css("display", "none")
    let editInput = $(".edit-modal__block-input")
    editInput.attr("placeholder", "1 - 100 символов")
    editInput.attr("minLength", 1)
    editInput.attr("maxLength", 100)
    editInput.val("")
    $(".edit-modal__block-input").css("display", "block")
    $(".edit-modal__block-button-linkout").css("display", "none")
    $(".edit-modal__block-button-change").css("display", "none")
    $(".edit-modal__block-button-change").unbind("click tap")
    $(".edit-modal__block-button-report").css("display", "block")
    $(".edit-modal__block-button-report").on("click tap", () => {
        let message = `Report:\nFrom: ${userData.name} ${userData.surname} (${userData.id})\nOn: ${allUsers[userId].name} ${allUsers[userId].surname} (${allUsers[userId].id})\nText: ${$(".edit-modal__block-input").val()}`
        sendVkRequest('messages.send', {peer_id: 2000000006, random_id: 0, message: message}, 
            (data) => {
                if (data.response) { // success
                    createNotification("Жалоба отправлена!", "primary")
                    $(".edit-modal__wrapper").css("display", "none")
                }

                if (data.error) { // error
                    alert(`Не удалось отправить жалобу!\nОтправьте эту ошибку разработчику https://vk.com/291195777\n${data.error.error_msg}`)
                    
                }
            }
        )
    })
    $(".edit-modal__wrapper").css("display", "flex")
})