import { getCache, setCache, removeCache } from "../../assets/scripts/cache.js"
import { linkTo, inputError, disableButton  } from "../../assets/scripts/global-functions.js"
import { notify } from "../../assets/scripts/notification/notification.js"
import { consts } from "../../assets/scripts/global-consts.js"
import { VKsendRequest, VKsendMessage, VKsendError } from "../../assets/scripts/vk-api.js"
import { GSgetEvent, sendGSRequest } from "../../assets/scripts/gs-api.js"

// Уникальный ключ
let unic_key = Math.random().toString(36).slice(6) + Math.random().toString(36).slice(6)

// Ставим ключ
$("#vkcode").text("Код: " + unic_key);


// Поля пользователя
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
    // Если пользователь не найден, но попытка подтвердить, то ошибка
    if (!user_id) {
        notify("Аккаунт не найден!", "danger")
        return
    }
    
    // Ставим подтверждение
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
    try {
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

        // Если логин меньше нужной длины
        if (!(formLogin.length >= consts.loginMin)) {
            inputError("#login")
            notify("Минимальная длина логина -  4 символа!", "danger")
            return
        }


        // Если нету пароля - ошибка поля
        if (!formPassword) {
            inputError("#password")
            return
        }

        // Если логин меньше нужной длины
        if (!(formPassword.length >= consts.passwordMin)) {
            inputError("#password")
            notify("Минимальная длина пароля - 4 символа!", "danger")
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
            notify("Пароли не совпадают!", "danger")
            return
        }

        // Таймштамп
        let date = Date.now()

        // Данные нового пользователя
        const newUserData = {
            id: user_id, // id на сайте, по стандарту id от вк, но в случае чего можно изменить вручную
            name: user_name,
            surname: user_surname,
            photo: user_photo,
            timestamp: date,
            vk_id: user_id, // Чаще всего совпадает, но если надо сделать профиль для группы, то можно изменить вручную
            vk_link: "https://vk.com/id" + user_id, // Ссылка на профиль, для групп другая

            // Рп информация
            about: {
                come_date: date, // Дата появления в РП - устанавливается администратором
                rp_name: user_name + " " + user_surname, // Замена настоящего имени
                description: "", // Описание
                сountry_id: "", // Отображаемая страна
                nation_id: "", // Отображаемая нация
                languages: "", // Языки на которых говорит
            }

        }

    } catch(error) {
        VKsendError("Произошла непредвиденная ошибка при попытке регистрации!", error)
    }
})

// GSgetEvent("users", {}, (data) => {
//     console.log(data);
// })


// sendGSRequest("users", "getEvent", {}, (data) => {
//     console.log("Выполнено");
//     console.log(data);
// })