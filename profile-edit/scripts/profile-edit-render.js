import { getCache } from "../../assets/scripts/cache.js";
import { relocate } from "../../assets/scripts/global-functions.js";

let userData = getCache("userData")

// Если нет юзердаты - перекинет на вход
if (!userData) {
    relocate("../login/")
}