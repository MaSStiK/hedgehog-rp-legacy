
// Ссылка для обращение к api
// const GoogleSheetURL = "https://script.google.com/macros/s/AKfycbyamHBWfy6Ym4Hm1vSEFXGxwlI9a3r9um7ILfrsfMi2/dev"
const GoogleSheetURL = "https://script.google.com/macros/s/AKfycbwZTgEMAERxxVlj2FHZjt9WZs_M-OQ6y4bUUEBMEs1yqE-9DjtxyjdcjM2yor83bR29gA/exec"


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


// --------------------get--------------------
// Получить ивент
export function GSgetEvent(sheet, data={}, func=null) {
    // sheet: any
    // data: any

    let sendData = {
        data: JSON.stringify(data),
        sheet: sheet,
        range: data.range
    }

    GSsendRequest("getEvent", sendData, func)
}


// Получить информацию по диапазону
export function GSgetColumn(sheet, data={}, func=null) {
    // sheet: name
    // data:
    //      column: "A" / "B"
    
    let sendData = {
        sheet: sheet,
        data: JSON.stringify(data),
        column: data.column
    }

    GSsendRequest("getColumn", sendData, func)
}


// Получить информацию по диапазону
export function GSgetRowById(sheet, data={}, func=null) {
    // sheet: name
    // data:
    //      id: int 
    
    let sendData = {
        sheet: sheet,
        data: JSON.stringify(data),
        id: data.id
    }

    GSsendRequest("getRowById", sendData, func)
}


// --------------------find--------------------
// Найти в колонне значение
export function GSfindInColumn(sheet, data={}, func=null) {
    // sheet: name
    // data: 
    //      column: column name
    //      value: string
    
    let sendData = {
        sheet: sheet,
        column: data.column,
        value: data.value
    }

    GSsendRequest("findInColumn", sendData, func)
}


// --------------------special--------------------
// Специльно для регистрации
export function GSregistration(sheet, data={}, func=null) {
    // sheet: "users"
    // data:
    //      userdata {id ... login, password}
    
    let sendData = {
        sheet: sheet,
        data: JSON.stringify(data),
    }

    GSsendRequest("registration", sendData, func)
}

// Специльно для входа
export function GSlogin(sheet, data={}, func=null) {
    // sheet: "usersAuth"
    // data:
    //      login
    //      password
    
    let sendData = {
        sheet: sheet,
        login: data.login,
        password: data.password
    }

    GSsendRequest("login", sendData, func)
}