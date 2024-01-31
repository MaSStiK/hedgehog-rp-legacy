import $ from "jquery";

export const CONSTS = {
    pageName: " | Ежиное-РП",

    loginTokenMax: 200,

    userNameMin: 1,
    userNameMax: 64,
    userBioMax: 850,
    userPhotoMax: 256,

    countryTitleMin: 1,
    countryTitleMax: 128,
    countryTagMax: 32,
    countryBioMainMax: 850,
    countryBioMoreMax: 850,

    postTitleMin: 1,
    postTitleMax: 128,
    postTextMax: 850,
    attachmentsCountMax: 10,

    photoMax: 512,
    photoPxMin: 40,
    photoPxMax: 1920,
}


// Анимация загрузки страницы
export function setPageLoading(show=true) {
    if (!show) {
        $("#page-loading").remove()
        return
    }

    $("#root").append(`<div id="page-loading"></div>`)
}


// Сортировка объекта в алфавитном порядке
export function sortAlphabetically(data, key) {
    return data.sort((a, b) => {
        return a[key].localeCompare(b[key])
    })
}