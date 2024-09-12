import { VKAPI } from "../API"
import { CONFIG } from "../Global"

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function DiceRoll(Context, textEvent, DiceType, additionalValue, DiceSendVk) {
    return new Promise((resolve, reject) => {
        // Проверка длины ивента
        if (textEvent.length > CONFIG.DICE_TEXT_MAX) return reject({text: `Событие больше ${CONFIG.DICE_TEXT_MAX} символов`, input: "event"})

        // Получаем случайное значение в диапазоне от 1 и до макс. колва граней (включительно)
        let result = getRandomInt(1, DiceType.faces)
        let resultAdditional = undefined
        let messageSended = false

        // Если кубик Д20 - применяем на него доп удачу
        if (DiceType.value === "d20" && additionalValue[0] !== 0) {
            resultAdditional = result + additionalValue[0]
            resultAdditional = resultAdditional < 1 ? 1 : resultAdditional
            resultAdditional = resultAdditional > DiceType.faces ? DiceType.faces : resultAdditional
        }

        // Отправляем сообщение в беседу
        if (DiceSendVk.value === "true") {
            // Проверяем таймер
            let timer = localStorage.diceCooldown !== undefined ? Number(localStorage.diceCooldown) : 0

            // Если прошло больше 30 секунд
            if (Math.round((Date.now() - timer) / 1000) > 30) {
                let message = textEvent ? `Событие: ${textEvent}\n` : "" // Событие перед сообщением
                message += `[id${Context.UserData.id}|${Context.UserData.name}] бросает кость д${DiceType.faces}\nВыпадает грань с числом: ${result}`
                if (resultAdditional !== undefined) { // Если доп удача
                    message += `\nНо удача (${additionalValue > 0 ? `+${additionalValue}` : additionalValue}) меняет грань на: ${resultAdditional}`
                }
                
                // Отправляем сообщение в беседу
                VKAPI("messages.send", {peer_id: 2000000001, random_id: 0, disable_mentions: 0, message: message})
                messageSended = true // Сообщение было отправлено
            }

            // Новые данные о настройках
            // let newUserData = {
            //     settings: {...Context.UserData.settings, diceCooldown: Date.now()}, // Новые настройки
            // }

            // // Всю главную информацию отправляем всегда
            // GSAPI("PUTuser", {token: Context.UserData.token, data: JSON.stringify(newUserData)}, (data) => {
            //     console.log("GSAPI: PUTuser");

            //     // Если ошибка
            //     if (!data.success || !Object.keys(data).length) return

            //     // Сохранение информации локально
            //     let userData = {...Context.UserData}
            //     userData.settings = newUserData.settings
            //     document.cookie = `UserData=${JSON.stringify(UserData)}; path=/; max-age=2592000; SameSite=Strict` // Сохраняем новые данные в куки
            //     Context.setUserData(userData)

            //     // Удаляем старого юзера и сохраняем нового
            //     let users = Context.Users.filter(user => user.id !== Context.UserData.id)
            //     users.push(userData)
            //     Context.setUsers(users)
            // })
        }

        resolve({
            result: result,
            resultAdditional: resultAdditional,
            additionalValue: additionalValue,
            messageSended: messageSended
        })
    })
}