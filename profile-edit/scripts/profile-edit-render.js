import { getCache } from "../../assets/scripts/cache.js";
import { relocate } from "../../assets/scripts/global-functions.js";

let userData = getCache("userData")

// Если нет юзердаты - перекинет на вход
if (!userData) {
    relocate("../login/")
}

function renderEdit(data) {
    $("#edit-id").val(data.id)
    $("#edit-tag").val(data.tag)
    $("#edit-photo").val(data.photo)
    $("#edit-name").val(data.name)
    $("#edit-bio").val(data.bio)
}

renderEdit(userData)