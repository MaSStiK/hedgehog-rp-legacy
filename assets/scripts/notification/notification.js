// Создание уведомления
export function notify(content, type=null) { 
    // type = null/primary/danger
    $("body").append(`<div class="notification">${content}</div>`)

    // Если тип кнопки "Важный", то добавляем класс primary
    if (type === "primary") {
        $(".notification").last().addClass("primary")
    } 
    
    // Если тип кнопки "Опасный", то добавляем класс danger
    if (type === "danger") {
        $(".notification").last().addClass("danger")
    }


    // Через 3 секунды удаляем
    setTimeout(() => {
        $(".notification").first().remove()
    }, 3000)
}