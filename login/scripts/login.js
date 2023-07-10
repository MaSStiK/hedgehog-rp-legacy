import { setCache, removeCacheAll } from "../../assets/scripts/cache.js"
import { relocate, inputError, disableButton  } from "../../assets/scripts/global-functions.js"
import { notify } from "../../assets/scripts/notification/notification.js"
import { consts } from "../../assets/scripts/global-consts.js"
import { VKsendMessage, VKsendError } from "../../assets/scripts/vk-api.js"
import { GSlogin } from "../../assets/scripts/gs-api.js"
import { loading } from "../../assets/scripts/loading/loading.js"

// Находим форму и ставим ивент submit
const form = document.querySelector('form')
form.addEventListener('submit', (event) => {
    try {
        // Отключение базового перехода
        event.preventDefault()

        // Отключаем кнопку
        disableButton("#form-submit")


        // Получаем поля из фомы
        const formData = new FormData(form)
        const formLogin = formData.get("login")
        const formPassword = formData.get("password")
        

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

        // Если пароль меньше нужной длины
        if (!(formPassword.length >= consts.passwordMin)) {
            inputError("#password")
            notify("Минимальная длина пароля -  4 символа!", "danger")
            return
        }


        // Если проходит все проверки то включаем анимацию загрузки
        loading()

        GSlogin({login: formLogin, password: formPassword}, (data) => {
            // Если не находит по логину и паролю
            if(Object.keys(data).length === 0) {
                loading(false)
                inputError("#login")
                inputError("#password")
                notify("Неверный логин или пароль!", "danger")
                return
            }

            // Парсим информацию, если она есть
            let userData = data


            // Удаляем весь старый хеш и записываем нового юзера
            removeCacheAll()
            setCache("userData", userData)

            // Для проверки пароля на актуальность
            setCache("userPassword", formPassword)


            // Отправляем сообщение в логи
            let message = `Вход\nПользователь: ${userData.name} (${userData.id})\nВК: ${"https://vk.com/id" + userData.id}`
            VKsendMessage(2000000007, message, () => {
                // Уведомление о регистрации
                setCache("after-login", "after-login")
    
                // Переносим на главную
                relocate("../home/index.html")
            })
        })
    } catch(error) {
        VKsendError("Произошла непредвиденная ошибка при попытке войти!", error)
    }
})

