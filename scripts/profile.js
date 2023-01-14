import {getData, updateData} from "./firebase.js"

let authorized
let userData = JSON.parse(window.localStorage.getItem("userData"))

authorized = userData ? true : false

if (!authorized) {
    window.location.href = "./index.html"
}

document.querySelector(".input-name").value = userData.name
document.querySelector(".input-login").value = userData.login
document.querySelector(".input-id").value = userData.id
document.querySelector(".input-password").value = userData.password

document.querySelector("#" + userData.avatar).selected = true


document.querySelector(".show-password").addEventListener("mousedown", () => {
    document.querySelector(".input-password").type = "text"
})

document.querySelector(".show-password").addEventListener("mouseup", () => {
    document.querySelector(".input-password").type = "password"
})

document.querySelector(".profile-exit").addEventListener("click", () => {
    window.localStorage.removeItem("userData")
    window.location.href = "./index.html"
})

document.querySelector(".profile-block__save").onclick = () => {
    if (userData.avatar === document.querySelector(".profile-block__avatar").value) {
        location.reload()
    } else {
        document.querySelector("body").classList.add("waiting")
        userData.avatar = document.querySelector(".profile-block__avatar").value
        updateData("users/" + userData.login, userData, (data) => {
            window.localStorage.setItem("userData", JSON.stringify(userData))
            document.querySelector("body").classList.remove("waiting")
            location.reload()
        })
    }
}