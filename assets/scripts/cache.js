// userData - Хеш информации о юзере
// userNationData - Хеш информации выбраной нации юзера
// userCountryData - Хеш информации страны юзера


// Получить значение из хеша
export function getCache(name) {
    try { // Пробуем получить информацию, если не удается спарсить, то удаляем
        let data = JSON.parse(localStorage.getItem(name))
        // console.log(`[+] Successfully parsed "${name}"`)
        return data
    } catch {
        // console.log(`[-] Unable to parse "${name}", deleting...`)
        localStorage.removeItem(name)
        return null
    }
}


// Сохраняем значение в хеш
export function setCache(name, data) {
    try { // Пробуем сохранить информацию , если не удается перевести в строку, то пропускаем
        localStorage.setItem(name, JSON.stringify(data))
        // console.log(`[+] Successfully stringified "${name}"`)
        return true
    } catch {
        // console.log(`[-] Unable to stringify "${name}", pass saving...`)
        return false
    }
}


// Удаляем значение в хеша
export function removeCache(name) {
    try { // Пробуем удалить информацию , если не удается удалить ячейку, то пропускаем
        localStorage.removeItem(name)
        // console.log(`[+] Successfully removed "${name}"`)
        return true
    } catch {
        // console.log(`[-] Unable to remove "${name}", pass removing...`)
        return false
    }
}