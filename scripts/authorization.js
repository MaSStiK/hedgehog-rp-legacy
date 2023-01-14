import {getData, updateData} from "./firebase.js"

// localStorage userData
let authorized
let userData = null
try {
    userData = JSON.parse(window.localStorage.getItem("userData"))
    document.querySelector(".login").value = userData.login
    document.querySelector(".password").value = userData.password
    authorized = true
} catch {
    authorized = false
}

document.querySelector(".to-registration__button").onclick = () => {
    document.querySelector(".login-block").style.display = "none"
    document.querySelector(".registration-block").style.display = "flex"
}

document.querySelector(".to-login__button").onclick = () => {
    document.querySelector(".registration-block").style.display = "none"
    document.querySelector(".login-block").style.display = "flex"
}

function checkPassword() {
    if (document.querySelector(".reg-password").value === document.querySelector(".reg-password-again").value) {
        document.querySelector(".reg-password-again").style.backgroundColor = "var(--second-bg)"
        document.querySelector(".reg-password-again").removeEventListener("input", checkPassword)
    }
}

document.querySelector(".reg-password-again").onchange = () => {
    if (document.querySelector(".reg-password").value !== document.querySelector(".reg-password-again").value) {
        document.querySelector(".reg-password-again").style.backgroundColor = "var(--error-color)"
        document.querySelector(".reg-password-again").addEventListener("input", checkPassword)
    }
}

function checkLogin() {
    document.querySelector(".reg-login").style.backgroundColor = "var(--second-bg)"
    document.querySelector(".reg-login").removeEventListener("input", checkLogin)
}

function inputErrorLogin() {
    document.querySelector(".login").style.backgroundColor = "var(--second-bg)"
    document.querySelector(".login").removeEventListener("input", inputErrorLogin)
}

function inputErrorPassword() {
    document.querySelector(".password").style.backgroundColor = "var(--second-bg)"
    document.querySelector(".password").removeEventListener("input", inputErrorPassword)
}

function setButtonDisabled(name) {
    document.querySelector(name).disabled = true
    setTimeout(() => {
        document.querySelector(name).disabled = false
    }, 3000)
}

const loginForm = document.querySelector('.login-form')
loginForm.addEventListener('submit', (event) => {
    event.preventDefault()
    document.querySelector("body").classList.add("waiting")
    setButtonDisabled(".submit")

    const formData = new FormData(loginForm)
    const formLogin = formData.get("login")
    const formPassword = formData.get("password")

    getData("users/" + formLogin, (data) => {
        if (data) {
            if (data.password === formPassword) {
                window.localStorage.setItem("userData", JSON.stringify(data))
                document.querySelector("body").classList.remove("waiting")
                window.location.href = "./index.html"
            } else {
                document.querySelector("body").classList.remove("waiting")
                document.querySelector(".login").style.backgroundColor = "var(--error-color)"
                document.querySelector(".login").addEventListener("input", inputErrorLogin)
                document.querySelector(".password").style.backgroundColor = "var(--error-color)"
                document.querySelector(".password").addEventListener("input", inputErrorPassword)
            }
        } else {
            document.querySelector("body").classList.remove("waiting")
            document.querySelector(".login").style.backgroundColor = "var(--error-color)"
            document.querySelector(".login").addEventListener("input", inputErrorLogin)
            document.querySelector(".password").style.backgroundColor = "var(--error-color)"
            document.querySelector(".password").addEventListener("input", inputErrorPassword)
        }
    })
})

const registrationForm = document.querySelector('.registration-form')
registrationForm.addEventListener('submit', (event) => {
    event.preventDefault()
    document.querySelector("body").classList.add("waiting")
    setButtonDisabled(".submit")

    const formData = new FormData(registrationForm)
    const formLogin = formData.get("login").toString()
    const formName = formData.get("name").toString()
    const formPassword = formData.get("password").toString()
    const formPasswordAgain = formData.get("password-again").toString()

    if (formPassword === formPasswordAgain) {
        try {
            getData("users/" + formLogin, (data) => {
                try {
                    // Установить курсор загрузки
                    if (data) { // Если юзер с таким ником уже сущетвует
                        throw "already registered"
                    } else {
                        let uniqueId = Date.now().toString().split("")
                        uniqueId = uniqueId.splice(uniqueId.length-6, uniqueId.length)
                        uniqueId = Number(uniqueId.join(''))
                        let userAgent
                        try {
                            userAgent = navigator.userAgentData
                        } catch {
                            userAgent = null
                        }

                        let date = new Date().toLocaleString('ru', {timeZone: 'Europe/Moscow'})
                        
                        let newUser = {
                            id: uniqueId,
                            login: formLogin,
                            name: formName,
                            password: formPassword,
                            avatar: "coolHedgehog",
                            meta: {
                                userAgent: userAgent,
                                creationDate: date
                            },
                            fields: {
                                postCount: 0,
                            }
                        }
                        
                        updateData("users/" + formLogin, newUser, (data) => {
                            window.localStorage.setItem("userData", JSON.stringify(newUser))
                            document.querySelector("body").classList.remove("waiting")
                            location.reload()
                        })
                    } 
                } catch {
                    document.querySelector("body").classList.remove("waiting")
                    document.querySelector(".reg-login").style.backgroundColor = "var(--error-color)"
                    document.querySelector(".reg-login").addEventListener("input", checkLogin)
                }
            })
        } catch {
            document.querySelector("body").classList.remove("waiting")
            document.querySelector(".reg-login").style.backgroundColor = "var(--error-color)"
            document.querySelector(".reg-login").addEventListener("input", checkLogin)
        }
        
    }
})