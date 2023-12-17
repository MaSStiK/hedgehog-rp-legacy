import $ from "jquery";


// Ссылка для обращение к api
const devGoogleSheetURL = "https://script.google.com/macros/s/AKfycbyamHBWfy6Ym4Hm1vSEFXGxwlI9a3r9um7ILfrsfMi2/dev"
const GoogleSheetURL = "https://script.google.com/macros/s/AKfycbz8Ci5JJ9vxNdd9w7dR5uXlGadlmtK5y9BHCkTyQLGnE_1dJP_1ZmKllKW-yCNpEq_1Lg/exec"


// Отправить запрос
export function GSAPI(action, data={}, func) {
    $.ajax({
        crossDomain: true,
        url: GoogleSheetURL + "?action=" + action,
        method: "GET",
        dataType: "JSONP",
        data: data,
        success: func,
    })
}


// // ----------------------------------------special----------------------------------------
// // Специльно для входа
// // data: login, password
// export function GETlogin(token, func=null) {
//     $.ajax({
//         crossDomain: true,
//         url: GoogleSheetURL + "?action=GETlogin",
//         method: "GET",
//         dataType: "JSONP",
//         data: {
//             token: token
//         },
//         success: func,
//     })
// }

// // Специльно для регистрации
// // data: userdata {id ... login, password}
// export function GSregistration(data={}, func=null) {
//     let sendData = {
//         data: JSON.stringify(data)
//     }

//     GSsendRequest("registration", sendData, func)
// }





// // Специльно для проверки пароля
// // data: id, password
// export function GScheckPassword(data={}, func=null) {
//     let sendData = {
//         id: data.id,
//         password: data.password
//     }

//     GSsendRequest("checkPassword", sendData, func)
// }


// // ----------------------------------------get----------------------------------------
// // Для получения юзера по id
// // data: id
// export function GSgetUserById(data={}, func=null) {
//     let sendData = {
//         id: data.id
//     }

//     GSsendRequest("getUserById", sendData, func)
// }


// // Для получения юзера по тегу
// // data: tag
// export function GSgetUserByTag(data={}, func=null) {
//     let sendData = {
//         tag: data.tag.toLowerCase() // В нижнем регистре
//     }

//     GSsendRequest("getUserByTag", sendData, func)
// }


// // Для получения всех юзеров или определенный список
// // data: type (all / ids), data: null / [id1, id2, id3 ...]
// export function GSgetAllUsers(data={}, func=null) {
//     let sendData = {
//         type: data.type,
//         data: data.data
//     }

//     GSsendRequest("getAllUsers", sendData, func)
// }


// // Для получения юзера по id
// // data: id
// export function GSgetCountryById(data={}, func=null) {
//     let sendData = {
//         id: data.id
//     }

//     GSsendRequest("getCountryById", sendData, func)
// }


// // Для получения юзера по тегу
// // data: tag
// export function GSgetCountryByTag(data={}, func=null) {
//     let sendData = {
//         tag: data.tag.toLowerCase() // В нижнем регистре
//     }

//     GSsendRequest("getCountryByTag", sendData, func)
// }


// // Для получения всех стран или определенный список
// // data: type (all / ids), data: null / [id1, id2, id3 ...]
// export function GSgetAllCountries(data={}, func=null) {
//     let sendData = {
//         type: data.type,
//         data: data.data
//     }

//     GSsendRequest("getAllCountries", sendData, func)
// }


// // ----------------------------------------find----------------------------------------
// // Найти в колонне значение
// // sheet (name), data: column (name), value (string)
// export function GSfindInColumn(sheet, data={}, func=null) {
//     let sendData = {
//         sheet: sheet,
//         column: data.column,
//         value: data.value
//     }

//     GSsendRequest("findInColumn", sendData, func)
// }


// // ----------------------------------------update----------------------------------------
// // Обновить информацию о пользователе
// // data: userData {id tag name ...}
// export function GSupdateUserData(data={}, func=null) {
//     let sendData = {
//         id: data.id,
//         data: JSON.stringify(data.data)
//     }

//     GSsendRequest("updateUserData", sendData, func)
// }


// // Обновить пароль пользователя
// // data: {id old new}
// export function GSupdateUserPassword(data={}, func=null) {
//     let sendData = {
//         id: data.id,
//         data: JSON.stringify(data.data)
//     }

//     GSsendRequest("updateUserPassword", sendData, func)
// }


// // Обновить избранные пользователя
// // data: {id favourite}
// export function GSupdateUserFavourite(data={}, func=null) {
//     let sendData = {
//         id: data.id,
//         data: JSON.stringify(data.data)
//     }

//     GSsendRequest("updateUserFavourite", sendData, func)
// }