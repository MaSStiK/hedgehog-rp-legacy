import { getCache, setCache, removeCache } from "../../assets/scripts/cache.js"
import { linkTo, inputError, disableButton  } from "../../assets/scripts/global-functions.js"
import { consts } from "../../assets/scripts/global-consts.js"


// Находим форму и ставим ивент submit
const form = document.querySelector('form')
form.addEventListener('submit', (event) => {
    // Отключение базового перехода
    event.preventDefault()

    // Отключаем кнопку
    disableButton("#form-submit")


    // Получаем поля из фомы
    const formData = new FormData(form)
    const formLogin = formData.get("login")
    const formPassword = formData.get("password")
    
    console.log(formData);
})