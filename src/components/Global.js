import $ from "jquery";

// Объект с константами значений
export const CONFIG = {
    AUTH_TOKEN_MAX:     50,     // Макс. Токен
    USER_NAME_MIN:      1,      // Мин.  Имя пользователя
    USER_NAME_MAX:      32,     // Макс. Имя пользователя
    USER_TAG_MAX:       16,     // Макс. Тег пользователя
    USER_BIO_MAX:       5000,   // Макс. Описание пользователя

    COUNTRY_TITLE_MIN:  1,      // Мин.  Название страны
    COUNTRY_TITLE_MAX:  32,     // Макс. Название страны
    COUNTRY_TAG_MAX:    16,     // Макс. Тег страны
    COUNTRY_BIO_MAX:    5000,   // Макс. Описание страны

    POST_TITLE_MIN:     1,      // Мин.  Заголовок поста
    POST_TITLE_MAX:     128,    // Макс. Заголовок поста
    POST_TEXT_MAX:      5000,   // Макс. Текст поста
    POST_ATTACH_MAX:    10,     // Макс. Кол-во картинок

    PHOTO_LINK_MAX:     5000,   // Макс. Ссылка на фото
    PHOTO_PX_MIN:       20,     // Мин. Размер фото
    PHOTO_PX_MAX:       1920,   // Макс. Размер фото

    POSTS_AMOUNT:       10,     // Кол-во передаваемых постов за одну загрузку
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
    return data.sort((a, b) => a[key].localeCompare(b[key]))
}


// Преобразовать timestamp в дату
export function timestampToDate(timestamp) {
    let date = new Date(timestamp)
    let hours = date.getHours().toString()
    let minutes = date.getMinutes().toString()
    let day = date.getDate().toString()
    let month = (date.getMonth() + 1).toString() // Добавляем 1 т.к. месяц начинается с нуля
    let year = date.getFullYear()
    minutes = minutes.length !== 2 ? "0" + minutes : minutes // Формат минут 00
    hours = hours.length !== 2 ? "0" + hours : hours // Формат часов 00
    day = day.length !== 2 ? "0" + day : day // Формат дня 00
    month = month.length !== 2 ? "0" + month : month // Формат месяца 00

    return {
        hours: hours,
        minutes: minutes,
        day: day,
        month: month,
        year: year,
        stringTime: `${hours}:${minutes}`,
        stringDate: `${day}.${month}.${year}`
    }
}