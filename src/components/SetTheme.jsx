import $ from "jquery"

export default function SetTheme(Context) {
    // Если в памяти нету темы - по умолчанию никакой
    if (Context.PageSettings["theme"] === undefined) { 
        let PageSettings = {...Context.PageSettings}
        PageSettings["theme"] = "default"
        localStorage.PageSettings = JSON.stringify(PageSettings)
        Context.setPageSettings(PageSettings)
    }

    // Если в памяти нету заднего фона - по умолчанию первый
    if (Context.PageSettings["bg"] === undefined) { 
        let PageSettings = {...Context.PageSettings}
        PageSettings["bg"] = "bg1"
        localStorage.PageSettings = JSON.stringify(PageSettings)
        Context.setPageSettings(PageSettings)
    }
    
    // Устанавливаем тему
    if (Context.PageSettings["theme"]) {
        $("body").attr("theme", Context.PageSettings["theme"])
    }

    // Устанавливаем задний фон
    if (Context.PageSettings["bg"] !== "false") {
        $("body").attr("bg", Context.PageSettings["bg"])
    } else { // Если задний фон отключен
        $("body").removeAttr("bg")
    }
}