export function loading(show=true) {
    if (show) {
        $("body").append(`<div id="loading"></div>`)
        return
    }

    $("#loading").remove()
}