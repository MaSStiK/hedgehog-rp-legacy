import { getCache, setCache } from "../../assets/scripts/cache.js";
import { disableButton, inputError, relocate } from "../../assets/scripts/global-functions.js";
import { GSgetUserById, GSupdateUserData, GSupdateUserPassword, GSfindInColumn } from "../../assets/scripts/gs-api.js";
import { loading } from "../../assets/scripts/loading/loading.js";
import { VKsendRequest } from "../../assets/scripts/vk-api.js";
import { consts } from "../../assets/scripts/global-consts.js";
import { notify } from "../../assets/scripts/notification/notification.js"


let userData = getCache("userData")
let photoReady = false

let vkName = ""
let vkPhoto = ""


function renderEdit(data) {
    $("#edit-id").val(data.id)
    $("#edit-tag").val(data.tag)
    $("#edit-photo").val(data.photo)
    $("#edit-name").val(data.name)
    $("#edit-bio").val(data.bio)

    
    // Тригерим обновление полей
    $("#edit-tag").trigger("input")
    $("#edit-photo").trigger("change")
    $("#edit-bio").trigger("input")
}

// Превью фотогрфии (Описан тут т.к меняет переменную)
$("#edit-photo").on("change", () => {
    $("#edit-photo-preview").attr("src", "../assets/images/base/base-photo-empty.png") // Ставим пустую картинку
    if ($("#edit-photo").val() !== "") { // Если значение не пустое
        photoReady = false
        let img = new Image()
        img.src = $("#edit-photo").val()
        img.onload = () => {
            photoReady = true
            $("#edit-photo-preview").attr("src", $("#edit-photo").val()) // Ставим новую
        }
        img.onerror = () => {
            photoReady = false
            inputError("#edit-photo")
        }
    }
})


// Если нет юзердаты - перекинет на вход
if (!userData) {
    relocate("../login/index.html")
} else {
    // Если все нормально, то загружаем данные и рендерим
    renderEdit(userData) // Рендер из памяти


    // Находим информацию о пользователе в вк
    VKsendRequest('users.get', {user_id: userData.id, fields: "photo_200"}, (vkData) => {
        vkData = vkData.response[0]

        vkName = vkData.first_name + " " + vkData.last_name
        vkPhoto = vkData.photo_200


        // Загружаем новые данные
        GSgetUserById({id: userData.id}, (data) => {
            userData = data
            setCache("userData", data)
            renderEdit(data)

            // Делаем поля доступными для изменения
            $("#edit-tag").removeAttr("readonly")
            $("#edit-photo").removeAttr("readonly")
            $("#edit-name").removeAttr("readonly")
            $("#edit-bio").removeAttr("readonly")

            // После загрузки актуальной информации разблокируем кнопку
            $("#edit-save").removeAttr("disabled")
        })
    })    
}


// Сбрасывает значения на те что были
$("#edit-cancel").on("click tap", () => {
    renderEdit(userData)
})


// Созраняем изменения
$("#edit-save").on("click tap", () => {
    // Отключаем кнопку
    disableButton("#edit-save")

    // Если фото не готово и не является пустым полем, то отмена
    if (!photoReady && $("#edit-photo").val() !== "") {
        inputError("#edit-photo")
        return
    }

    let newTag = $("#edit-tag").val()
    let newPhoto = $("#edit-photo").val()
    let newName = $("#edit-name").val()
    let newBio = $("#edit-bio").val()


    // Проверка длины (защита от изменения)
    if (newTag.length > consts.tagMax) {
        inputError("#edit-tag")
        notify(`Максимальная длинна тега - ${consts.tagMax} символа!`, "danger")
        return
    }

    if (newPhoto.length > consts.photoMax) {
        inputError("#edit-photo")
        notify(`Максимальная длинна фотографии - ${consts.photoMax} символа!`, "danger")
        return
    }

    if (newName.length > consts.nameMax) {
        inputError("#edit-name")
        notify(`Максимальная длинна имени - ${consts.nameMax} символа!`, "danger")
        return
    }

    if (newBio.length > consts.newBio) {
        inputError("#edit-bio")
        notify(`Максимальная длинна описания - ${consts.newBio} символа!`, "danger")
        return
    }


    if (!isNaN(newTag.substring(1))) {
        inputError("#edit-tag")
        notify(`В теге должна быть как минимум одна буква!`, "danger")
        return
    }


    // Если тег старый то не проверяем его уникальность
    let isTagOld = true
    if (userData.tag !== newTag) {
        isTagOld = false
    }


    // Если тег пустой то ставим тег как id юзера
    userData.tag = newTag !== "@" ? newTag : "@" + userData.id

    // Если фото пустое, то ставим из вк
    userData.photo = newPhoto !== "" ? newPhoto : vkPhoto

    // Если имя пустое, то ставим из вк
    userData.name = newName !== "" ? newName : vkName

    userData.bio = newBio

    loading()

    
    if (isTagOld) { // Если тег старый, то просто сохраняем
        GSupdateUserData({id: userData.id, data: userData}, () => {
            // Сохраняем и обновляем страницу
            setCache("userData", userData)
            location.reload()
        })
    } else { // Если новый, то проверяем на уникальность
        GSfindInColumn("users", {column: "tag", value: newTag}, (data) => {
            // Если найден - не обновляем
            if (data.length !== 0) {
                inputError("#edit-tag")
                notify(`Этот тег занят!`, "danger")
                loading(false)
                return
            }
    
            GSupdateUserData({id: userData.id, data: userData}, () => {
                // Сохраняем и обновляем страницу
                setCache("userData", userData)
                location.reload()
            })
        })
    }
})


// Сохранение информации
$("#modal-submit").on("click tap", () => {
    // loading()
    disableButton("#modal-submit")

    let oldPass = $("#password-old").val()
    let newPass = $("#password-new").val()
    let againPass = $("#password-again").val()

    // Проверка длины (защита от изменения)
    if (oldPass.length < consts.passwordMin) {
        inputError("#password-old")
        notify(`Минимальная длина пароля - ${consts.passwordMin} символа!`, "danger")
        return
    }

    if (oldPass.length > consts.passwordMax) {
        inputError("#password-old")
        notify(`Максимальная длина пароля - ${consts.passwordMax} символа!`, "danger")
        return
    }

    if (newPass.length < consts.passwordMin) {
        inputError("#password-new")
        notify(`Минимальная длина пароля - ${consts.passwordMin} символа!`, "danger")
        return
    }

    if (newPass.length > consts.passwordMax) {
        inputError("#password-new")
        notify(`Максимальная длина пароля - ${consts.passwordMax} символа!`, "danger")
        return
    }

    if (againPass.length < consts.passwordMin) {
        inputError("#password-again")
        notify(`Минимальная длина пароля - ${consts.passwordMin} символа!`, "danger")
        return
    }

    if (againPass.length > consts.passwordMax) {
        inputError("#password-again")
        notify(`Максимальная длина пароля - ${consts.passwordMax} символа!`, "danger")
        return
    }


    // Не совпадают пароли
    if (newPass !== againPass) {
        inputError("#password-new")
        inputError("#password-again")
        notify(`Пароли не совпадают!`, "danger")
        return
    }


    GSupdateUserPassword({id: userData.id, data: {old: oldPass, new: newPass}}, (data) => {
        if (data.success) {
            // Сохраняем новый пароль
            setCache("userPassword", newPass)
            location.reload()
        } else {
            inputError("#password-old")
        }
    })
})