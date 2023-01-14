import {getData} from "./firebase.js"

let authorized
let userData = JSON.parse(window.localStorage.getItem("userData"))

authorized = userData ? true : false

if (authorized) {
    document.querySelector(".header__profile-name").innerText =  userData.name
    document.querySelector(".header__profile").style.display = "flex"
} else {
    document.querySelector(".header__login").style.display = "flex"
}

function renderUsers(data) {
    let userList = document.querySelector(".user-list")
    userList.innerHTML = ""
    Object.keys(data).forEach(element => {
        let userBlock = document.createElement("div")
        userBlock.classList.add("user-block")

        let userBlock__image = document.createElement("img")
        userBlock__image.classList.add("user-block__image")
        userBlock__image.src = `./assets/avatars/${data[element].avatar}.png`

        let userBlock__data = document.createElement("div")
        userBlock__data.classList.add("user-block__data")

        let userBlock__name = document.createElement("p")
        userBlock__name.classList.add("user-block__name")
        userBlock__name.innerText = data[element].name

        let userBlock__tag = document.createElement("p")
        userBlock__tag.classList.add("user-block__tag")
        userBlock__tag.innerText = data[element].login + "#" + data[element].id

        userBlock.append(userBlock__image)
        userBlock.append(userBlock__data)
        userBlock__data.append(userBlock__name)
        userBlock__data.append(userBlock__tag)

        userList.append(userBlock)
    });
}

getData("users/", (data) => {
    window.localStorage.setItem("allUsers", JSON.stringify(data))
    renderUsers(data)
})

renderUsers(JSON.parse(window.localStorage.getItem("allUsers")))