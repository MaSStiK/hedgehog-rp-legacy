let authorized
let userData = JSON.parse(window.localStorage.getItem("userData"))

authorized = userData ? true : false

if (authorized) {
    document.querySelector(".header__profile-image").src = `./assets/avatars/${userData.avatar}.png`
    document.querySelector(".header__profile-name").innerText =  userData.name
    document.querySelector(".header__profile").style.display = "flex"
} else {
    document.querySelector(".header__login").style.display = "flex"
}