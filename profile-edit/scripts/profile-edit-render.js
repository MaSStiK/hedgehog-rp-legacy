import { getCache, setCache } from "../../assets/scripts/cache.js";
import { inputError, relocate } from "../../assets/scripts/global-functions.js";
import { GSgetRowById, GSupdateUserData } from "../../assets/scripts/gs-api.js";

let userData = getCache("userData")
let photoReady = false


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
})


// Если нет юзердаты - перекинет на вход
if (!userData) {
    relocate("../login/")
} else {
    // Если все нормально, то загружаем данные и рендерим
    renderEdit(userData) // Рендер из памяти

    // Загружаем новые данные
    GSgetRowById("users", {id: userData.id}, (data) => {
        userData = data
        setCache("userData", data)
        renderEdit(data)  
    })
}


// Сбрасывает значения на те что были
$("#edit-cancel").on("click tap", () => {
    renderEdit(userData)
})


// Сбрасывает значения на те что были
$("#edit-save").on("click tap", () => {
    GSupdateUserData("users", {id: userData.id})
    // renderEdit(userData)
})

// GSupdateUserData