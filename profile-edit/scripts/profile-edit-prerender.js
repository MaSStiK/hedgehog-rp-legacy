import { relocate, initInputWithoutSpaces } from "../../assets/scripts/global-functions.js";


// Кнопка назад 
$("#edit-back").on("click tap", () => {
    relocate("../profile/")
})

// Кнопка назад  навигации
$("#edit-back-nav").on("click tap", () => {
    relocate("../profile/")
})


// Объявляем инпут без пробелов
initInputWithoutSpaces("#edit-tag")

// Если удалили @ в начале тега, то возвращаем
$("#edit-tag").on("input", () => {
    if (!$("#edit-tag").val().startsWith("@")) {
        $("#edit-tag").val("@" + $("#edit-tag").val())
    }
})


// Количество символов в bio
$("#edit-bio").on("input", () => {
    $("#edit-bio-count").text($("#edit-bio").val().length + "/" + $("#edit-bio").attr("maxlength"))
})