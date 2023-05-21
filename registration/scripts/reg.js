import { getCache, setCache, removeCache } from "../../assets/scripts/cache.js"
import { linkTo, inputError, disableButton  } from "../../assets/scripts/global-functions.js"
import { notify } from "../../assets/scripts/notification/notification.js"
import { consts } from "../../assets/scripts/global-consts.js"
import { VKsendRequest, VKsendMessage } from "../../assets/scripts/vk-api.js"

// Уникальный ключ
let unic_key = Math.random().toString(36).slice(6) + Math.random().toString(36).slice(6)

// Ставим ключ
$("#vkcode").text("Код: " + unic_key);


// Поля которые надо выяснить
let user_id = null
let user_name = null
let user_surname = null
let user_photo = null

// Подтвердил ли пользователь аккаунт
let confirm_account = false


// Переход на второй блок если бот находит сообщение
$("#first-page-button").on("click tap", () => {
    // Отключаем кнопку
    disableButton("#first-page-button")

    // Получаем все диалоги
    VKsendRequest('messages.getConversations', {}, (data) => {
        data = data.response

        // Перебираем все последние сообщения в чате
        for (let msg of data.items) {
            // Если находит сообщение с ключем, то записывает id юзера и заканчивает цикл
            if (msg.last_message.text === unic_key) {
                user_id = msg.last_message.from_id
                break
            }
        }
        
        // Если не нашло юзера с сообщением, то выводим сообщение и обрываем выполнение
        if (!user_id) {
            notify("Сообщение не найдено!", "danger")
            return
        }


        // Находим информацию о пользователе
        VKsendRequest('users.get', {user_id: user_id, fields: "photo_200"}, (data) => {
            data = data.response[0]
            user_name = data.first_name
            user_surname = data.last_name
            user_photo = data.photo_200

            // Рендерим профиль
            $("#vk-photo").attr("src", user_photo)
            $("#vk-name").text(user_name + " " + user_surname)

            // Переход на следующий блок
            $("#first-page").addClass("hidden")
            $("#second-page").removeClass("hidden")
        })
    })
})


// Переход на финальный блок
$("#second-page-yes").on("click tap", () => {
    // Ставим подтверждение профиля
    confirm_account = true

    // Переход на следующий блок
    $("#second-page").addClass("hidden")
    $("#last-page").removeClass("hidden")
})

// Возвращение на первый блок
$("#second-page-no").on("click tap", () => {
    // Убираем подтверждение профиля и найденый id юзера
    confirm_account = false
    user_id = null

    // Меняем ключ
    unic_key = Math.random().toString(36).slice(6) + Math.random().toString(36).slice(6)

    // Ставим новый ключ
    $("#vkcode").text("Код: " + unic_key);

    // Переход на первый слайд блок
    $("#second-page").addClass("hidden")
    $("#first-page").removeClass("hidden")
})



// Находим форму и ставим ивент submit
const form = document.querySelector('form')
form.addEventListener('submit', (event) => {
    // Отключение базового перехода
    event.preventDefault()

    // Отключаем кнопку
    disableButton("#form-submit")

    // Проверяем не нарушена ли последовательность действий
    if (!confirm_account) {
        notify("Профиль в ВКонтакте еще не прикреплен!", "danger")
        return
    }

    // Получаем поля из фомы
    const formData = new FormData(form)
    const formLogin = formData.get("login")
    const formPassword = formData.get("password")
    const formPasswordAgain = formData.get("password-again")
    
    // Если нету логина - ошибка поля
    if (!formLogin) {
        inputError("#login")
        return
    }

    // Если нету логина - ошибка поля
    if (formLogin.length >= 15) {
        inputError("#login")
        return
    }

    // Если нету пароля - ошибка поля
    if (!formPassword) {
        inputError("#password")
        return
    }

    // Если нету повтора пароля - ошибка поля
    if (!formPasswordAgain) {
        inputError("#password-again")
        return
    }

    // Если пароли не совпадают - ошибка обоих полей
    if (formPassword !== formPasswordAgain) {
        inputError("#password")
        inputError("#password-again")
        return
    }
})