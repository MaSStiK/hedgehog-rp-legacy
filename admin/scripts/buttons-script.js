import { getCache, setCache, removeCache } from "../../assets/scripts/cache.js"
import { renderNavigation } from "../../assets/scripts/nav/nav-render.js"


$("#set-userData").on("click tap", () => {
    if (!getCache("userData")) { // Пушим данные если их нет
        setCache("userData", {data: "data"})
    } else {
        removeCache("userData")
    }
    renderNavigation()
})

$("#set-userCountryData").on("click tap", () => {
    if (!getCache("userCountryData")) { // Пушим данные если их нет
        setCache("userCountryData", {data: "data"})
    } else {
        removeCache("userCountryData")
    }
    renderNavigation()
})

$("#remove-all").on("click tap", () => {
    removeCache("userData")
    removeCache("userCountryData")
    renderNavigation()
})