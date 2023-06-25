
// Ссылка для обращение к api
// const GoogleSheetURL = "https://script.google.com/macros/s/AKfycbyamHBWfy6Ym4Hm1vSEFXGxwlI9a3r9um7ILfrsfMi2/dev"
const GoogleSheetURL = "https://script.google.com/macros/s/AKfycbzgFIfeLSRoMgAmPKsIkvAF7gO9oVjyoomnbsgkb2vrK4Bppi2me5_hS6RxUS6LmXNofg/exec"


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


// ----------------------------------------update----------------------------------------
// Найти в колонне значение
// data: column (name), value (string)
export function GSupdateUserData(data={}, func=null) {
    let sendData = {
        id: data.id,
        data: JSON.stringify(data.data)
    }

    GSsendRequest("updateUserData", sendData, func)
}


// ----------------------------------------special----------------------------------------
// Специльно для регистрации
// data: userdata {id ... login, password}
export function GSregistration(data={}, func=null) {
    let sendData = {
        data: JSON.stringify(data)
    }

    GSsendRequest("registration", sendData, func)
}

// Специльно для входа
// data: login, password
export function GSlogin(data={}, func=null) {
    let sendData = {
        login: data.login,
        password: data.password
    }

    GSsendRequest("login", sendData, func)
}

// Для получения юзера по тегу
// data: tag
export function GSgetUserByTag(data={}, func=null) {
    let sendData = {
        tag: data.tag.toLowerCase() // В нижнем регистре
    }

    GSsendRequest("getUserByTag", sendData, func)
}