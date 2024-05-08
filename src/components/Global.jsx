import $ from "jquery";

// Объект описывающий длину значений
export const CONSTS = {
    loginTokenMax: 50,

    userNameMin: 1,
    userNameMax: 32,
    userBioMax: 850,
    userPhotoMax: 256,

    countryTitleMin: 1,
    countryTitleMax: 32,
    countryTagMax: 16,
    countryBioMax: 2000,

    postTitleMin: 1,
    postTitleMax: 128,
    postTextMax: 850,
    attachmentsCountMax: 10,

    photoMax: 512,
    photoPxMin: 40,
    photoPxMax: 1920,
}

// Функция для установки заголовка страницы
export function setPageTitle(title) {
    document.title = `${title} | Ежиное-РП`
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