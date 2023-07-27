import { renderAside } from "../../assets/scripts/aside/aside.js";
import { getCache } from "../../assets/scripts/cache.js";


// Рендер aside если усть юзердата
let userData = getCache("userData")

if (userData) {
    renderAside()
} else {
    $("aside").remove()
}



// 1 минута - 6 часов
// 1 минута - 144 минут
// 60 сек - 8640 сек
// 1 сек - 144 сек


// setInterval(() => {
//     let timeStamp = new Date().getTime()

//     // Минус лишние года и плюс дата корректирования
//     let rpDate = new Date(((timeStamp*144) - 202852252800000 + 29289600000))
//     // console.log(rpDate.toISOString().slice(0, -5).replaceAll('T', ' ').replaceAll('-', '.'))
//     let year = rpDate.getFullYear()
//     let month = ("0" + (rpDate.getMonth() + 1)).substr(-2)
//     let day = ("0" + rpDate.getDate()).substr(-2);
//     let hours = ("0" + rpDate.getHours()).substr(-2);
//     let minutes = ("0" + rpDate.getMinutes()).substr(-2)
//     let seconds = ("0" + rpDate.getSeconds()).substr(-2)

//     $("#rp-time").text(`Время на Кулсториробобе: ${day}.${month}.${year} ${hours}:${minutes}:${seconds}`)

// }, 100)