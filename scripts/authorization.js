import {sendGSRequest, sendVkRequest, setInputError, createNotification, setButtonDisabled, logger, sendError} from "./scripts-base.js"

if (localStorage.getItem("registered")) {
    createNotification("Вы успешно зарегистрированы", "primary")
    localStorage.removeItem("registered")
}

$(".login-logo").on("click tap", () => { // Переход на главную с логина
    location.href = "./index.html"
})

$(".reg-logo").on("click tap", () => { // Переход на главную с регистрации
    location.href = "./index.html"
})

$(".switch-registeration").on("click tap", () => { // Переход на регистрацию
    $(".login-block").css("display", "none")
    $(".registration-block").css("display", "flex")
})

$(".switch-login").on("click tap", () => { // Переход на вход
    $(".registration-block").css("display", "none")
    $(".login-block").css("display", "flex")
})

let inputs = [$(".reg-login"), $(".reg-name"), $(".reg-surname"), $(".reg-password"), $(".reg-password-again")]
inputs.forEach(element => {
    element.on("input", () => {
        element.val(element.val().split(' ').join('_'))
    })
})

$(".reg-password-again").on("change", () => { // Несовпадение пароля
    if ($(".reg-password").val() !== $(".reg-password-again").val()) {
        setInputError(".reg-password")
        setInputError(".reg-password__img")
        setInputError(".reg-password-again")
        setInputError(".reg-password-again__img")
    }
})

$(".login-password__img").on("click tap", () => { // Показать/спрятать пароль логина
    if ($(".login-password__img").hasClass("show-password")) {
        $(".login-password__img").removeClass("show-password")
        $(".login-password__img").attr("src", "./assets/EyeOpen.svg")
        $(".login-password").attr("type", "password")
    } else {
        $(".login-password__img").addClass("show-password")
        $(".login-password__img").attr("src", "./assets/EyeClosed.svg")
        $(".login-password").attr("type", "text")
    }
})

$(".reg-password__img").on("click tap", () => { // Показать/спрятать пароль регистрации
    if ($(".reg-password__img").hasClass("show-password")) {
        $(".reg-password__img").removeClass("show-password")
        $(".reg-password__img").attr("src", "./assets/EyeOpen.svg")
        $(".reg-password").attr("type", "password")
    } else {
        $(".reg-password__img").addClass("show-password")
        $(".reg-password__img").attr("src", "./assets/EyeClosed.svg")
        $(".reg-password").attr("type", "text")
    }
})

$(".reg-password-again__img").on("click tap", () => { // Показать/спрятать пароль регистрации повтор
    if ($(".reg-password-again__img").hasClass("show-password")) {
        $(".reg-password-again__img").removeClass("show-password")
        $(".reg-password-again__img").attr("src", "./assets/EyeOpen.svg")
        $(".reg-password-again").attr("type", "password")
    } else {
        $(".reg-password-again__img").addClass("show-password")
        $(".reg-password-again__img").attr("src", "./assets/EyeClosed.svg")
        $(".reg-password-again").attr("type", "text")
    }
})

// Форма входа
const loginForm = document.querySelector('.login-form')
loginForm.addEventListener('submit', (event) => {
    event.preventDefault() // Отключение базового перехода
    // setBlockWaiting("body")
    setButtonDisabled(".login-submit")

    const formData = new FormData(loginForm)
    const formLogin = formData.get("login")
    const formPassword = formData.get("password")
    $(".reg-waiting").addClass("reg-waiting-show")
    try {
        localStorage.clear() // Очистка от всего лишнего, и загрузка заного
        logger("[-] Old data cleaned")
        sendGSRequest("usersLogins", "findValueInRange", {range: "B:B", value: formLogin}, (data) => {
            try {
                let idRange = "A" + data.split("")[1] // Получаем рендж айдишника
                sendGSRequest("usersPasswords", "getDataByRange", {range: idRange}, (data) => { // Получили айдишник
                    let user_id = data
                    sendGSRequest("usersPasswords", "getValueCompareById", {id: user_id, value: formPassword}, (data) => {
                        if (data) {  // Если пароль совпадает то входим
                            logger("[+] Correct password")
                            sendGSRequest("users", "getDataById", {id: user_id}, (data) => {
                                logger("[+] Get user data")
                                let user_data = data
                                localStorage.setItem("userData", JSON.stringify(user_data))
                                localStorage.setItem("afterAthorization", "afterAthorization") // Обновление хеша на главной страницы
                                localStorage.setItem("userPassword", formPassword) // Для проверки пароля
                                let message = `Авторизация:\nПользователь: ${user_data.name} ${user_data.surname} (${user_data.id})`
                                sendVkRequest('messages.send', {peer_id: 2000000007, random_id: 0, message: message}, 
                                    (data) => {
                                        if (data.response) { // success
                                            location.href = "./index.html"
                                        }
                                    }
                                )
                            })
                        } else { // Не совпал пароль
                            logger("[-] Incorrect password")
                            $(".reg-waiting").removeClass("reg-waiting-show")
                            setInputError(".login-login")
                            setInputError(".login-password")
                            setInputError(".login-password__img")
                        }
                    })
                })
            } catch {
                $(".reg-waiting").removeClass("reg-waiting-show")
                setInputError(".login-login")
                setInputError(".login-password")
                setInputError(".login-password__img") 
            }
        })
    } catch {
        $(".reg-waiting").removeClass("reg-waiting-show")
        setInputError(".login-login")
        setInputError(".login-password")
        setInputError(".login-password__img")
    }
})

// Форма регистрации
const registrationForm = document.querySelector('.registration-form')
registrationForm.addEventListener('submit', (event) => {
    event.preventDefault() // Отключение базового перехода
    // setBlockWaiting("body")
    setButtonDisabled(".reg-submit")

    const formData = new FormData(registrationForm)
    const formLogin = formData.get("login")
    const formName = formData.get("name")
    const formSurname = formData.get("surname")
    const formPassword = formData.get("password")
    const formPasswordAgain = formData.get("password-again")

    if (formLogin.length < 4) { // Если логин меньше 4 символов
        logger("[-] Login < 4 symbols")
        setInputError(".reg-login")
        return
    }

    if (formPassword.length < 4 || formPasswordAgain.length < 4) { // Если пароль или повтор пароля меньше 4 символов
        logger("[-] Password < 4 symbols")
        setInputError(".reg-password")
        setInputError(".reg-password-again")
        setInputError(".reg-password__img")
        setInputError(".reg-password-again__img")
        return
    }
    
    if (formPassword !== formPasswordAgain) { // Если пароли не совпадают
        logger("[-] Passwords is not the same")
        setInputError(".reg-password")
        setInputError(".reg-password-again")
        setInputError(".reg-password__img")
        setInputError(".reg-password-again__img")
        return
    }

    try {
        // Если в столбике B есть такой логин, то не создаем пользоваеля
        $(".reg-waiting").addClass("reg-waiting-show")
        sendGSRequest("usersLogins", "findValueInRange", {range:"B:B", value: formLogin}, (data) => {
            try {
                if (data) { // Если найдено идентичное совпадение
                    logger("[-] Login is not unic")
                    setInputError(".reg-login")
                    $(".reg-waiting").removeClass("reg-waiting-show")
                    return
                }
                logger("[+] Login is unic")
                let id = Math.round(Math.random() * (99999999 - 10000000) + 10000000).toString()
                // let date = new Date().toLocaleString('ru', {timeZone: 'Europe/Moscow'})
                let date = Date.now()
                let newUser = {
                    id: id, // Уникальный id
                    uid: id, // id который указывает пользователь
                    // login: formLogin, // Логин
                    // password: formPassword, // Пароль
                    name: formName, // Имя
                    surname: formSurname, // Фамилия
                    avatar: "https://sun9-31.userapi.com/impg/G2LIF9CtQnTtQ4P9gRxJmvQAa1_64hPsOAe4sQ/E7KVVKP75MM.jpg?size=427x320&quality=96&sign=e5665d0791b6119869af1b0ee46bec8f&type=album", // Аватарка
                    creationDate: date,
                    about: { // Блок информации
                        gameName: formName + " " + formSurname, // Игровое имя
                        rpDate: date, // Дата появления в рп
                        сountry: "", // Страна
                        сountryRole: "", // Роль в стране
                        nation: "", // Нация
                        languages: "", // Языки на которых говорит
                        vkLink: "", // Ссылка на вк
                        status: "", // Статус
                    },
                    fields: { // Доп поля
                        postCount: 0,
                    }
                }
                localStorage.clear() // Очистка от всего лишнего, и загрузка заного
                logger("[-] Old data cleaned")
                sendGSRequest("users", "addDataById", newUser, (data) => { // Добовляем в бд
                    logger("[+] User data sended")
                    localStorage.setItem("userData", JSON.stringify(newUser))
                    sendGSRequest("usersLogins", "addValueById", {id: id,value: formLogin}, (data) => { // Допом записываем id / login
                        logger("[+] Login sended")
                        sendGSRequest("usersPasswords", "addValueById", {id: id, value: formPassword}, (data) => { // Допом записываем id / password
                            logger("[+] Password sended")
                            let message = `Регистрация:\nПользователь: ${formName} ${formSurname} (${id})\nДанные: ${formLogin} ${formPassword}`
                            sendVkRequest('messages.send', {peer_id: 2000000007, random_id: 0, message: message}, 
                                (data) => {
                                    if (data.response) { // success
                                        localStorage.setItem("registered", "registered")
                                        location.reload()
                                    }
                                }
                            )
                        })
                    })
                })
            } catch(error) {
                sendError("Произошла непредвиденная ошибка на стадии отправки формы!", userData, error)
            }
        })
    } catch(error) {
        sendError("Произошла непредвиденная ошибка на стадии регистрации!", userData, error)
    }
})