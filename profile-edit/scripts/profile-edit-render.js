import { getCache, setCache } from "../../assets/scripts/cache.js";
import { disableButton, inputError, relocate } from "../../assets/scripts/global-functions.js";
import { GSgetRowById, GSupdateUserData } from "../../assets/scripts/gs-api.js";
import { VKsendRequest } from "../../assets/scripts/vk-api.js";

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
    $("#edit-photo-preview").remove() // Удаляем старую картинку
    if ($("#edit-photo").val() !== "") { // Если значение не пустое
        photoReady = false
        let img = new Image()
        img.src = $("#edit-photo").val()
        img.onload = () => {
            photoReady = true
            $("#edit-photo").after(`<img id="edit-photo-preview" src="${$("#edit-photo").val()}">`)
        }
        img.onerror = () => {
            photoReady = false
            inputError("#edit-photo")
        }
    }
})


// Если нет юзердаты - перекинет на вход
if (!userData) {
    relocate("../login/")
} else {
    // Если все нормально, то загружаем данные и рендерим
    renderEdit(userData) // Рендер из памяти


    // Находим информацию о пользователе в вк
    VKsendRequest('users.get', {user_id: userData.id, fields: "photo_200"}, (vkData) => {
        vkData = vkData.response[0]

        vkName = vkData.first_name + " " + vkData.last_name
        vkPhoto = vkData.photo_200


        // Загружаем новые данные
        GSgetRowById("users", {id: userData.id}, (data) => {
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

    // Если тег пустой то ставим тег как id юзера
    userData.tag = newTag !== "@" ? newTag : "@" + userData.id

    // Если фото пустое, то ставим из вк
    userData.photo = newPhoto !== "" ? newPhoto : vkPhoto

    // Если имя пустое, то ставим из вк
    userData.name = newName !== "" ? newName : vkName

    userData.bio = newBio
    
    GSupdateUserData({id: userData.id, data: userData}, (data) => {
        // Сохраняем и обновляем страницу
        setCache("userData", userData)
        location.reload()
    })
})