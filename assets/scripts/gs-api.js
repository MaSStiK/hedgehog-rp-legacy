
// Ссылка для обращение к api
// const GoogleSheetURL = "https://script.google.com/macros/s/AKfycbyamHBWfy6Ym4Hm1vSEFXGxwlI9a3r9um7ILfrsfMi2/dev"
const GoogleSheetURL = "https://script.google.com/macros/s/AKfycbzfV3xCsa0hHsIrhZRsjv7PekDvSndyN120G76amoITzioQj_1H1YILz6OR67-_SIHCDw/exec"


// Отправить запрос
export function GSsendRequest(action, data={}, func) {
    $.ajax({
        crossDomain: true,
        url: GoogleSheetURL + "?action=" + action,
        method: "GET",
        dataType: 'JSONP',
        data: data,
        success: func,
    })
}


// ----------------------------------------get----------------------------------------
// Получить ивент
// sheet (any), data (any)
export function GSgetEvent(sheet, data={}, func=null) {
    let sendData = {
        data: JSON.stringify(data),
        sheet: sheet,
        range: data.range
    }

    GSsendRequest("getEvent", sendData, func)
}


// Получить информацию по диапазону
// sheet (name), data: column (name)
export function GSgetColumnByName(sheet, data={}, func=null) {
    let sendData = {
        sheet: sheet,
        column: data.column
    }

    GSsendRequest("getColumnByName", sendData, func)
}


// Получить информацию по диапазону
// sheet (name), data: id
export function GSgetRowById(sheet, data={}, func=null) {
    let sendData = {
        sheet: sheet,
        id: data.id
    }

    GSsendRequest("getRowById", sendData, func)
}


// ----------------------------------------find----------------------------------------
// Найти в колонне значение
// sheet (name), data: column (name), value (string)
export function GSfindInColumn(sheet, data={}, func=null) {
    let sendData = {
        sheet: sheet,
        column: data.column,
        value: data.value
    }

    GSsendRequest("findInColumn", sendData, func)
}


// ----------------------------------------special----------------------------------------
// Специльно для регистрации
// sheet "users", data: userdata {id ... login, password}
export function GSregistration(sheet, data={}, func=null) {
    let sendData = {
        sheet: sheet,
        data: JSON.stringify(data),
    }

    GSsendRequest("registration", sendData, func)
}

// Специльно для входа
// sheet "usersAuth", data: login, password
export function GSlogin(sheet, data={}, func=null) {
    let sendData = {
        sheet: sheet,
        login: data.login,
        password: data.password
    }

    GSsendRequest("login", sendData, func)
}

// Для получения юзера по тегу
// sheet "users", data: tag
export function GSgetUserByTag(sheet, data={}, func=null) {
    let sendData = {
        sheet: sheet,
        tag: data.tag.toLowerCase() // В нижнем регистре
    }

    GSsendRequest("getUserByTag", sendData, func)
}