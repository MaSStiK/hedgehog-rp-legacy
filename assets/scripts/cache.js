// userData - Хеш информации о юзере
// userNationData - Хеш информации выбраной нации юзера
// userCountryData - Хеш информации страны юзера


// Получить значение из хеша
export function getCache(name) {
    let item = localStorage.getItem(name)
    if (item !== null) { // Если значение не пустое
        try { // Пробуем получить информацию, если не удается спарсить, то удаляем
            let data = JSON.parse(decodeURIComponent(atob(item)))
            // console.log(`[+] Successfully parsed "${name}"`)
            return data
        } catch {
            // console.log(`[-] Unable to parse "${name}", deleting...`)
            localStorage.removeItem(name)
            return null
        }
    } else {
        return null
    }    
}


// Сохраняем значение в хеш
export function setCache(name, data=null) {
    try { // Пробуем сохранить информацию, если не удается перевести в строку, то пропускаем
        localStorage.setItem(name, btoa(encodeURIComponent(JSON.stringify(data))))
        // console.log(`[+] Successfully stringified "${name}"`)
        return true
    } catch {
        // console.log(`[-] Unable to stringify "${name}", pass saving...`)
        return false
    }
}


// Удаляем значение в хеша
export function removeCache(name) {
    try { // Пробуем удалить информацию, если не удается удалить ячейку, то пропускаем
        localStorage.removeItem(name)
        // console.log(`[+] Successfully removed "${name}"`)
        return true
    } catch {
        // console.log(`[-] Unable to remove "${name}", pass removing...`)
        return false
    }
}


// Удаляем все значение в хеша
export function removeCacheAll() {
    try { // Удаляем всю информацию
        localStorage.clear();
        // console.log(`[+] Successfully removed all`)
        return true
    } catch {
        // console.log(`[-] Unable to remove all, pass removing...`)
        return false
    }
}