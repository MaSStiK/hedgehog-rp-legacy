
// Ссылка для обращение к api
const GoogleSheetURL = "https://script.google.com/macros/s/AKfycbyamHBWfy6Ym4Hm1vSEFXGxwlI9a3r9um7ILfrsfMi2/dev"

export function sendGSRequest(sheet, action, data={}, func=null) {
    const sendData = {
        sheet: sheet
    }
    switch(action) {
        // actions:
        case "getEvent": // getEvent sendGSRequest("any", "getEvent", {}, (data) => {})
            sendData.data = JSON.stringify(data)
            break;
        default:
            break;
    }
    console.log(GoogleSheetURL + "?action=" + action,);
    $.ajax({
        crossDomain: true,
        url: GoogleSheetURL + "?action=" + action,
        method: "GET",
        dataType: 'JSONP',
        data: sendData,
        success: func,
    })
}


// Отправить запрос
export function GSsendRequest(action, data={}, func=null) {
    console.log(data);
    $.ajax({
        crossDomain: true,
        // url: GoogleSheetURL + "?action=" + action,
        method: "GET",
        dataType: 'JSONP',
        // data: data,
        success: func,
    })
}


export function GSgetEvent(sheet, data={}, func=null) {
    // Data: any
    data.sheet = sheet
    GSsendRequest("getEvent", data, func)
}