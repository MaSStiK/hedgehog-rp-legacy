import { CONFIG, getRandomInt} from "../Global"

async function sendTextToTelegram(text) {
    try {
        await fetch("https://hedgehog-rp-api.vercel.app/api/telegram", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text }) // передаем текст в теле
        });

    } catch (error) {
        console.error("Ошибка отправки:", error);
    }
}

export default async function DiceRoll(Context, textEvent, DiceType, additionalValue, DiceResultSend) {
    // Проверка длины ивента
    if (textEvent.length > CONFIG.DICE_TEXT_MAX) {
        throw { text: `Событие больше ${CONFIG.DICE_TEXT_MAX} символов`, input: "event" }
    }

    // Получаем случайное значение в диапазоне от 1 и до макс. колва граней (включительно)
    let result = getRandomInt(1, DiceType.faces)
    let resultAdditional = undefined
    let messageSended = false

    // Если кубик Д20 - применяем доп удачу
    if (DiceType.value === "d20" && additionalValue[0] !== 0) {
        resultAdditional = result + additionalValue[0]
        resultAdditional = resultAdditional < 1 ? 1 : resultAdditional
        resultAdditional = resultAdditional > DiceType.faces ? DiceType.faces : resultAdditional
    }

    if (DiceResultSend.value === "true") {
        // Проверяем таймер
        let timer = localStorage.diceCooldown !== undefined ? Number(localStorage.diceCooldown) : 0

        // Если прошло больше 30 секунд
        if (Math.round((Date.now() - timer) / 1000) > 30) {
            let message = textEvent ? `Событие: ${textEvent}\n` : "" // Событие перед сообщением
            message += `${Context.UserData.name} бросает кость д${DiceType.faces}\nВыпадает грань с числом: ${result}`

            if (resultAdditional !== undefined) {
                message += `\nНо удача (${additionalValue > 0 ? `+${additionalValue}` : additionalValue}) меняет грань на: ${resultAdditional}`
            }

            await sendTextToTelegram(message)
            messageSended = true
        }
    }

    return {
        result,
        resultAdditional,
        additionalValue,
        messageSended
    }
}