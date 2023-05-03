import {logger, sendGSRequest, createNotification, setInputError, setButtonDisabled, sendVkRequest, sendError} from "../global/scripts-base.js"
// localStorage.clear()

// localStorage userData, userSelectedNation
let userData = JSON.parse(localStorage.getItem("userData")) // Храним только Важную информацию

let userSelectedNation = {}
try { // Пробуем получить нацию пользователя, если не удается спарсить то удаляем
    userSelectedNation = JSON.parse(localStorage.getItem("userSelectedNation"))
} catch {
    logger("[-] Error in userSelectedNation, deleting...")
    localStorage.removeItem("userSelectedNation")
}

let userProfileData = null
let authorized = userData ? true : false
let selfRender = false
let findedNation = null

let nowEditing = ""
let avaReady = false

// http://127.0.0.1:5500/profile.html?id=MaSStiK
let urlParams = new URLSearchParams(location.search)
let params = {}
urlParams.forEach((e, key) => {
    params[key] = e
})

// -------------------- Узнаем способ рендера --------------------
try {
    if ("id" in params) { // Если указан id
        if (params.id === userData?.id || params.id === userData?.tag) { // Если указан указан айди и он равен либо id либо tag пользователя
            logger("[R] Render authorized-user by id", params.id)
            selfRender = true
            renderUser(userData)
            sendGSRequest("users", "getDataById", userData, (data) => {
                logger("[+] Received authorized-user data")
                userData = data
                localStorage.setItem("userData", JSON.stringify(userData))
                sendGSRequest("nations", "getDataById", {id: userData.about.nation !== "" ? userData.about.nation : "noname"}, (data) => {
                    findedNation = data
                    logger("[+] Received authorized-user nation")
                    renderUser(userData, true)
                })
                
                
            })
        } else { // Получаем информацию о любом другом пользователе и рендерим ее
            $(".waiting").addClass("waiting-show")
            sendGSRequest("users", "getData", {}, (data) => {
                logger("[+] Received all users data")
                if (params.id in data) { // Если id во всех юзерах
                    userProfileData = data[params.id]
                    sendGSRequest("nations", "getDataById", {id: userProfileData.about.nation !== "" ? userProfileData.about.nation : "noname"}, (data) => {
                        findedNation = data
                        logger("[+] Received user nation")
                        logger("[R] Render user by id", userProfileData.id)
                        $(".waiting").removeClass("waiting-show")
                        renderUser(userProfileData, true)
                    })
                    
                } else { // Если нету то проверка tag 
                    let found = false
                    Object.keys(data).forEach((user_id) => { // Если неправильный айди то проверка tag
                        if (data[user_id].tag.toString() === params.id.toString()) {  
                            found = data[user_id]
                        }
                    })
                    userProfileData = found

                    if (found) { // Если найден tag
                        sendGSRequest("nations", "getDataById", {id: userProfileData.about.nation !== "" ? userProfileData.about.nation : "noname"}, (data) => {
                            findedNation = data
                            logger("[+] Received user nation")
                            logger("[R] Render user by tag", userProfileData.id)
                            $(".waiting").removeClass("waiting-show")
                            renderUser(userProfileData, true)
                        })
                        
                    } else { // Если не найден то выкидвает на главную
                        logger("[-] Incorrect id")
                        alert(`Не удалось отобразить страницу пользователя, причина в несуществующем id!\nIncorrect id`)
                        location.href = "../home/index.html"
                    }
                }
            })
        }
    } else { 
        if (authorized) { // Если не указан айди и но авторизован - рендер своей странички из памяти
            logger("[R] Render authorized-user", userData.id)
            selfRender = true
            renderUser(userData)
            sendGSRequest("users", "getDataById", userData, (data) => {
                logger("[+] Received authorized-user data")
                localStorage.setItem("userData", JSON.stringify(data))
                userData = data
                renderUser(userData, true)
            })
        } else { // Если не указан айди и не авторихован
            logger("[-] Not authorized")
            alert(`Вы пытаетесь просмотреть свою страницу будучи не авторизованным!\nNot authorized!`)
            location.href = "../home/index.html"
        }
    }
} catch(error) {
    sendError("Не удалось отобразить страницу пользователя!", userData, error)
}

// -------------------- Рендер страницы --------------------
function renderUser(user, finalRender=false) {
    if (selfRender) {
        $(".block-avatar__exit").removeClass("hide-block") // Делаем кнопку выхода видимой
        $(".block-avatar__report").remove() // Удаляем кнопку репорта
        $(".edit-modal__block-button-report").remove() // Удаляем кнопку репорта из модального окна
        if (finalRender) { // При конечном рендере добавляем кнопки редактирования
            $(".block-info__button-edit").css("display", "flex") // Делаем кнопку редактирования профиля видимой
            $(".block-info__button-settings").css("display", "flex") // Делаем кнопку редактирования приватной информации видимой
        }   
    } else {
        $(".block-avatar__exit").remove() // Удаляем кнопку выхода
        $(".block-info__button-edit").remove() // Удаляем кнопку
        $(".block-info__button-settings").remove() // Удаляем кнопку
    }

    $(".avatar-opened__img").attr("src", user.avatar)
    $(".info-vkName").text(user.vkName)
    $(".block-avatar__avatar").css("background-image", `url(${user.avatar})`)
    $(".info-tag").text("@" + user.tag)
    if (user.about.gameName !== "") {
        $(".info-gameName").text(user.about.gameName)
    }
    let date = new Date(user.about.rpDate).toLocaleString('ru', {timeZone: 'Europe/Moscow'})
    $(".info-rpDate").text(date.split(",")[0])
    if (user.about.сountry !== "") {
        $(".info-сountry").text(`${user.about.сountry} (${user.about.сountryRole})`)
    }
    if (user.about.nation !== "") {
        if (finalRender) { // Если финальный рендер, то все должно быть загружено
            if (findedNation) { // Если указаная нация не найдена то удаляем
                $(".info-nation").text(findedNation.name)
                $(".info-nation").removeClass("primary-text").addClass("link-text")
                $(".info-nation").unbind("click tap")
                $(".info-nation").on("click tap", () => {
                    location.href = "../nations/index.html?search=" + findedNation.name.replace(" ", "%20")
                })
                if (selfRender) {
                    localStorage.setItem("userSelectedNation", JSON.stringify(findedNation)) // Обновляем если рендер себя
                }
            } else { // Если нацию удалили а она осталась у пользователя то удаляем ее у пользователя
                user.about.nation = ""
                $(".info-nation").text("Не указано")
                $(".info-nation").removeClass("link-text").addClass("primary-text")
                $(".info-nation").unbind("click tap")
                sendGSRequest("users", "updateDataById", user, (data) => {
                    if (selfRender) { // Если рендерим себя удаляем у себя
                        localStorage.setItem("userData", JSON.stringify(user))
                        localStorage.removeItem("userSelectedNation") // Удаляем выбраную нацию
                    }
                })
            }
        } else { // Не финальный рендер
            if (selfRender && userSelectedNation) { // Если рендер себя и сохранена нация
                logger("[R] Render authorized-user nation")
                $(".info-nation").text(userSelectedNation.name)
                $(".info-nation").removeClass("primary-text").addClass("link-text")
                $(".info-nation").unbind("click tap")
                $(".info-nation").on("click tap", () => {
                    location.href = "../nations/index.html?search=" + userSelectedNation.name.replace(" ", "%20")
                })
            }
            // А у других юзеров сразу финальный рендер
        }
    }

    if (user.about.languages !== "") {
        $(".info-languages").text(user.about.languages)
    }

    if (user.about.vkLink !== "") {
        $(".info-vkId").text(user.about.vkLink)
        $(".info-vkId").removeClass("primary-text").addClass("link-text")
        $(".info-vkId").unbind("click tap")
        $(".info-vkId").on("click tap", () => {
            open(user.about.vkLink, "_blank")
        })
    }

    if (user.about.status !== "") {
        $(".info-status").text(user.about.status)
    }

    // В конце рендера пишем какой был рендер
    if (!finalRender) {
        logger("[✓] Fully rendered")
    } else {
        logger("[✓] Fully finaly rendered")
    }
}   

// -------------------- Эдит мод --------------------
$(".block-info__button-edit").on("click tap", () => { 
    if (selfRender) { // Если авторизованный изменяет свой профиль
        if ($(".block-info__button-edit").hasClass("edit-mode-on")) { // Если включен
            logger("[+] Edit mode")
            $(".block-info__button-edit").removeClass("edit-mode-on")
            $(".edit-tag").remove()
            $(".edit-gameName").remove()
            $(".edit-rpDate").remove()
            $(".edit-сountry").remove()
            $(".edit-nation").remove()
            $(".edit-languages").remove()
            $(".edit-status").remove()
            $(".edit-avatar").remove()
            $(".block-avatar__avatar-black").css("display", "none")
            $(".avatar-fullscreen__wrapper").css("display", "flex")
        } else {
            logger("[-] Edit mode")
            $(".block-info__button-edit").addClass("edit-mode-on")
            $(".info-tag").after(`<img src="../assets/Edit.svg" alt="edit" class="edit-mode edit-mode-little edit-tag">`)
            $(".info-gameName").after(`<img src="../assets/Edit.svg" alt="edit" class="edit-mode edit-gameName">`)
            $(".info-rpDate").after(`<img src="../assets/Edit.svg" alt="edit" class="edit-mode edit-rpDate">`)
            $(".info-сountry").after(`<img src="../assets/Edit.svg" alt="edit" class="edit-mode edit-сountry">`)
            $(".info-nation").after(`<img src="../assets/Edit.svg" alt="edit" class="edit-mode edit-nation">`)
            $(".info-languages").after(`<img src="../assets/Edit.svg" alt="edit" class="edit-mode edit-languages">`)
            $(".block-info__status-wrapper").after(`<img src="../assets/Edit.svg" alt="edit" class="edit-mode edit-status">`)
            $(".avatar-fullscreen__wrapper").css("display", "none")
            $(".block-avatar__avatar-black").append(`<img src="../assets/Edit.svg" alt="edit" class="edit-mode edit-avatar">`)
            $(".block-avatar__avatar-black").css("display", "flex")

            $(".edit-tag").on("click tap", () => {
                nowEditing = "tag"
                $(".edit-modal__block-title").text(`Изменение поля "Тег (tag)"`)
                $(".edit-modal__block-text").text(`Введите новое значение:`)
                $(".edit-modal__block-help").css("display", "block")
                $(".edit-modal__block-help2").css("display", "block")
                $(".edit-modal__block-textarea").css("display", "none")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "1 - 16 символов")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 16)
                editInput.val(userData.tag)
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    setButtonDisabled(".edit-modal__block-button-change")
                    $(".waiting").addClass("waiting-show")
                    if (selfRender) {
                        if (editInput.val() === "") { // Если инпут пустой то просто ставим айдишник и сохраняем
                            userData.tag = userData.id
                            sendGSRequest("users", "updateDataById", userData, (data) => {
                                localStorage.setItem("userData", JSON.stringify(userData))
                                location.reload()
                            })
                        } else { // Если не пусто то проверяем на совпадение и потом сохраняем
                            let newTag = $(".edit-modal__block-input").val()
                            sendGSRequest("users", "getData", {}, (data) => {
                                let pass = true
                                Object.keys(data).forEach((element) => {
                                    if (data[element].tag === newTag) { // Ищем совпадение
                                        if (data[element].id !== userData.id) { // Если это не tag этого пользователя
                                            pass = false
                                        }
                                    }
                                })

                                if (pass) { // Если tag уникальный то сохраняем
                                    userData.tag = newTag
                                    sendGSRequest("users", "updateDataById", userData, (data) => {
                                        localStorage.setItem("userData", JSON.stringify(userData))
                                        location.reload()
                                    })
                                } else { // Если нет то ошибка
                                    setInputError(".edit-modal__block-input")
                                    $(".waiting").removeClass("waiting-show")
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
                $(".edit-modal__block-textarea").css("display", "none")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "1 - 64 символов")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 64)
                editInput.val(userData.about.gameName)
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    setButtonDisabled(".edit-modal__block-button-change")
                    $(".waiting").addClass("waiting-show")
                    if (selfRender) {
                        if (editInput.val() === "") { // Если инпут пустой то ставим имя фамилия 
                            userData.about.gameName = userData.vkName
                        } else {
                            userData.about.gameName = $(".edit-modal__block-input").val()
                        }
                        sendGSRequest("users", "updateDataById", userData, (data) => {
                            localStorage.setItem("userData", JSON.stringify(userData))
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
                $(".edit-modal__block-textarea").css("display", "none")
                $(".edit-modal__block-input").css("display", "none")
                $(".edit-modal__block-button-linkout").css("display", "block")
                $(".edit-modal__block-button-linkout").unbind("click tap")
                $(".edit-modal__block-button-linkout").on("click tap", () => {
                    location.href = "../about/index.html" // Изменить ссылку на о нас (администрация)
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
                $(".edit-modal__block-textarea").css("display", "none")
                $(".edit-modal__block-input").css("display", "none")
                $(".edit-modal__block-button-linkout").css("display", "block")
                $(".edit-modal__block-button-linkout").unbind("click tap")
                $(".edit-modal__block-button-linkout").on("click tap", () => {
                    location.href = "../countries/index.html"
                })
                $(".edit-modal__block-button-change").css("display", "none")
                $(".edit-modal__wrapper").css("display", "flex")
            })

            $(".edit-nation").on("click tap", () => {
                nowEditing = "nation"
                $(".edit-modal__block-title").text(`Изменение поля "Нация"`)
                $(".edit-modal__block-text").text(`Это поле заполнится автоматически когда вы выбирите нацию на специальной странице!`)
                $(".edit-modal__block-help").css("display", "none")
                $(".edit-modal__block-help2").css("display", "none")
                $(".edit-modal__block-textarea").css("display", "none")
                $(".edit-modal__block-input").css("display", "none")
                $(".edit-modal__block-button-linkout").css("display", "block")
                $(".edit-modal__block-button-linkout").unbind("click tap")
                $(".edit-modal__block-button-linkout").on("click tap", () => {
                    location.href = "../nations/index.html"
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
                $(".edit-modal__block-textarea").css("display", "none")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "1 - 64 символа")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 64)
                editInput.val(userData.about.languages)
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    setButtonDisabled(".edit-modal__block-button-change")
                    $(".waiting").addClass("waiting-show")
                    if (selfRender) {
                        userData.about.languages = $(".edit-modal__block-input").val()
                        sendGSRequest("users", "updateDataById", userData, (data) => {
                            localStorage.setItem("userData", JSON.stringify(userData))
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
                $(".edit-modal__block-input").css("display", "none")
                $(".edit-modal__block-textarea").css("display", "block")
                let editTextarea = $(".edit-modal__block-textarea")
                editTextarea.val(userData.about.status)
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    setButtonDisabled(".edit-modal__block-button-change")
                    $(".waiting").addClass("waiting-show")
                    if (selfRender) {
                        userData.about.status = $(".edit-modal__block-textarea").val()
                        sendGSRequest("users", "updateDataById", userData, (data) => {
                            localStorage.setItem("userData", JSON.stringify(userData))
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
                $(".edit-modal__block-textarea").css("display", "none")
                let editInput = $(".edit-modal__block-input")
                editInput.attr("placeholder", "Ссылка на картинку")
                editInput.attr("minLength", 1)
                editInput.attr("maxLength", 1000)
                editInput.val(userData.avatar)
                $(".edit-modal__block-input").trigger("change");
                $(".edit-modal__block-input").css("display", "block")
                $(".edit-modal__block-button-linkout").css("display", "none")
                $(".edit-modal__block-button-change").css("display", "block")
                $(".edit-modal__block-button-change").unbind("click tap")
                $(".edit-modal__block-button-change").on("click tap", () => {
                    setButtonDisabled(".edit-modal__block-button-change")
                    $(".waiting").addClass("waiting-show")
                    if (selfRender) {
                        if ($(".edit-modal__block-input").val() === "") { // Если пусто то стаим фотографию по умолчанию
                            userData.avatar = "https://sun9-31.userapi.com/impg/G2LIF9CtQnTtQ4P9gRxJmvQAa1_64hPsOAe4sQ/E7KVVKP75MM.jpg?size=427x320&quality=96&sign=e5665d0791b6119869af1b0ee46bec8f&type=album"
                            sendGSRequest("users", "updateDataById", userData, (data) => {
                                localStorage.setItem("userData", JSON.stringify(userData))
                                location.reload()
                            })
                        } else { // Если не пусто то проверяем фотографию
                            if (avaReady) {
                                userData.avatar = $(".edit-modal__block-input").val()
                                sendGSRequest("users", "updateDataById", userData, (data) => {
                                    localStorage.setItem("userData", JSON.stringify(userData))
                                    location.reload()
                                })
                            } else {
                                setInputError(".edit-modal__block-input")
                                $(".waiting").removeClass("waiting-show")
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
    location.href = "../settings/index.html"
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
    if (nowEditing === "vkId") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().replace(/ +/g, ' ').trim())
    }
    if (nowEditing === "status") {
        // $(".edit-modal__block-input").val($(".edit-modal__block-input").val().replace(/ +/g, ' ').trim())
    }
    if (nowEditing === "avatar") {
        $(".avatar-preview").remove()
        avaReady = false
        let img = new Image()
        img.src = $(".edit-modal__block-input").val()
        img.onload = () => {
            avaReady = true
            logger("[I] Image loaded", avaReady)
            $(".edit-modal__block-input").after(`<div class="avatar-preview"></div>`)
            $(".avatar-preview").css("background-image", `url(${$(".edit-modal__block-input").val()})`)
        }
        img.onerror = () => {
            avaReady = false
            logger("[I] Image error", avaReady)
            setInputError(".edit-modal__block-input")
        }
    }
    if (nowEditing === "report") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().replace(/ +/g, ' ').trim())
    }
})

$(".edit-modal__block-input").on("input", () => { // Текст без пробелов
    if (nowEditing === "tag") {
        $(".edit-modal__block-input").val($(".edit-modal__block-input").val().split(' ').join('_'))
    }
})

$(".block-info__button-share").on("click tap", () => { // Скопировать ссылку на профиль
    try {
        navigator.clipboard.writeText(location)
        createNotification("Ссылка на профиль скопирована!")
        logger("[+] Copied\n", location)
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

$(".block-avatar__exit").on("click tap", () => { // Выход из профиля
    localStorage.clear()
    location.href = "../authorization/index.html"
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
    $(".edit-modal__block-textarea").css("display", "none")
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
        if (!selfRender) {
            setButtonDisabled(".edit-modal__block-button-report")
            if ($(".edit-modal__block-input").val() === "") {
                setInputError(".edit-modal__block-input")
                return
            }
            let message = `Жалоба:\nОт: ${userData.vkName} (${userData.id})\nНа: ${userProfileData.vkName} (${userProfileData.id})\nТекст: ${$(".edit-modal__block-input").val()}`
            sendVkRequest('messages.send', {peer_id: 2000000006, random_id: 0, message: message}, 
                (data) => {
                    if (data.response) { // success
                        createNotification("Жалоба отправлена!", "primary")
                        $(".edit-modal__wrapper").css("display", "none")
                    }

                    if (data.error) { // error
                        sendError("Не удалось отправить жалобу!", userData, error)
                    }
                }
            )
        } else {
            createNotification("Нельзя отправить жалобу на самого себя!", "danger")
            $(".edit-modal__wrapper").css("display", "none")
        }
    })
    $(".edit-modal__wrapper").css("display", "flex")
})