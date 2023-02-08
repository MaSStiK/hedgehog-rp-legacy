import {getData, updateData, setInputError, setBlockWaiting, setButtonDisabled} from "./scripts-base.js"

// localStorage userData
let userData
try {
    userData = JSON.parse(window.localStorage.getItem("userData"))
} catch {
    userData = null
}

let authorized = userData ? true : false

if (authorized) { // Автозаполнение если сохранен пользователь
    $(".login-login").val(userData.login)
    $(".login-password").val(userData.password)
}

$(".login-logo").on("click tap", () => { // Переход на главную с логина
    window.location.href = "./index.html"
})

$(".reg-logo").on("click tap", () => { // Переход на главную с регистрации
    window.location.href = "./index.html"
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
    setBlockWaiting("body")
    setButtonDisabled(".login-submit")

    const formData = new FormData(loginForm)
    const formLogin = formData.get("login")
    const formPassword = formData.get("password")
    try {
        getData("logins/" + formLogin, (data) => { // Получаем id по логину
            getData("users/" + data.uniqueId, (data) => { // Получаем данные по id
                try {
                    if (data.password === formPassword) { // Если логин не существует или пароль не подошел то ошибка
                        window.localStorage.setItem("userData", JSON.stringify(data))
                        window.location.href = "./index.html"
                    } else {
                        throw Error
                    }
                } catch {
                    setInputError(".login-login")
                    setInputError(".login-password")
                    setInputError(".login-password__img")
                }
            })
        })
    } catch {
        setInputError(".login-login")
        setInputError(".login-password")
        setInputError(".login-password__img")
    }
})

// Форма регистрации
const registrationForm = document.querySelector('.registration-form')
registrationForm.addEventListener('submit', (event) => {
    event.preventDefault() // Отключение базового перехода
    setBlockWaiting("body")
    setButtonDisabled(".reg-submit")

    const formData = new FormData(registrationForm)
    const formLogin = formData.get("login")
    const formName = formData.get("name")
    const formSurname = formData.get("surname")
    const formPassword = formData.get("password")
    const formPasswordAgain = formData.get("password-again")
    
    if (formPassword !== formPasswordAgain) {
        setInputError(".reg-password")
        setInputError(".reg-password-again")
        setInputError(".reg-password__img")
        setInputError(".reg-password-again__img")
        return
    }

    try {
        getData("users/" + formLogin, (data) => {
            try {
                if (data) {
                    setInputError(".reg-login")
                    return
                } else {
                    let uniqueId = Math.round(Math.random() * (99999999 - 10000000) + 10000000).toString()
                    // let date = new Date().toLocaleString('ru', {timeZone: 'Europe/Moscow'})
                    let date = Date.now()
                    let userAgent
                    try {
                        userAgent = navigator.userAgentData
                    } catch {
                        userAgent = null
                    }

                    let newUser = {
                        id: uniqueId, // Уникальный id
                        uid: uniqueId, // id который указывает пользователь
                        login: formLogin, // Логин
                        password: formPassword, // Пароль
                        tag: `@${uniqueId}`, // Тег @uid
                        name: formName, // Имя
                        surname: formSurname, // Фамилия
                        avatar: "../assets/avatars/coolHedgehog.png", // Аватарка
                        meta: { // Мета данные
                            userAgent: userAgent,
                            creationDate: date,
                        },
                        about: { // Блок информации
                            gameName: formName + " " + formSurname, // Игровое имя
                            rpDate: date, // Дата появления в рп
                            сountry: "", // Страна
                            сountryRole: "", // Роль в стране
                            race: "", // Раса
                            languages: "", // Языки на которых говорит
                            vkLink: "", // Ссылка на вк
                            vkConfirmed: false, // Подтвержден ли вк
                            status: "", // Статус
                        },
                        fields: { // Доп поля
                            postCount: 0,
                        }
                    }

                    updateData("users/" + uniqueId, newUser, (data) => { // В БД хранится по id 
                        window.localStorage.setItem("userData", JSON.stringify(newUser))
                        updateData("logins/" + formLogin, {uniqueId}, (data) => { // Допом записываем login = id
                            location.reload()
                        })
                    })
                }
            } catch(error) {
                alert(`Произошла непредвиденная ошибка на стадии отправки формы!\nОтправьте эту ошибку разработчику https://vk.com/291195777\n${error}`)
                location.reload()
            }
        })
    } catch(error) {
        alert(`Произошла непредвиденная ошибка на стадии регистрации!\nОтправьте эту ошибку разработчику https://vk.com/291195777\n${error}`)
        location.reload()
    }
})