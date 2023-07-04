import { relocate, initInputWithoutSpaces, initInputNormalSpaces, initInputPassword } from "../../assets/scripts/global-functions.js";
import { consts } from "../../assets/scripts/global-consts.js"
import { getCache } from "../../assets/scripts/cache.js";


let userData = getCache("userData")

// Ставим пределы для полей
$("#edit-tag").attr("maxlength", consts.tagMax)
$("#edit-name").attr("maxlength", consts.nameMax)
$("#edit-bio").attr("maxlength", consts.bioMax)
$("#edit-photo").attr("maxlength", consts.photoMax)


// Поля смены пароля
$("#password-old").attr("minlength", consts.passwordMin)
$("#password-old").attr("maxlength", consts.passwordMax)
$("#password-new").attr("minlength", consts.passwordMin)
$("#password-new").attr("maxlength", consts.passwordMax)
$("#password-again").attr("minlength", consts.passwordMin)
$("#password-again").attr("maxlength", consts.passwordMax)


// Кнопка назад 
$("#edit-back").on("click tap", () => {
    relocate(`../profile/index.html?id=${userData.id}`)
})

// Кнопка назад  навигации
$("#edit-back-nav").on("click tap", () => {
    relocate(`../profile/index.html?id=${userData.id}`)
})


// Объявляем инпут без пробелов
initInputWithoutSpaces("#edit-tag")

// Инпуты с нормальными пробелами
initInputNormalSpaces("#edit-photo")
initInputNormalSpaces("#edit-name")

// Инпуты с паролем
initInputPassword("#password-old-input")
initInputPassword("#password-new-input")
initInputPassword("#password-again-input")


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



// Открытие модального окна
$("#edit-password").on("click tap", () => {
    $(".modal-wrapper").removeClass("hidden");
})

// Нажатие на обвертку модального окна - закрывается
$(".modal-wrapper").on("click tap", (event) => {
    // Если клик на саму обвертку
    if (event.target.classList.contains("modal-wrapper")) {
        $(".modal-wrapper").addClass("hidden")
    }
})

// Кнопка Отмена в модальном окне
$("#modal-close").on("click tap", () => {
    $(".modal-wrapper").addClass("hidden")
})