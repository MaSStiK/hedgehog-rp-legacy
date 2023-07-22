import { renderAside } from "../../assets/scripts/aside/aside.js";
import { getCache } from "../../assets/scripts/cache.js";


// Рендер aside если усть юзердата
let userData = getCache("userData")

if (userData) {
    renderAside()
} else {
    $("aside").remove()
}