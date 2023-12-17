import { useRef, useEffect, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import { GSAPI } from "../GS-API"
import { CONSTS, setPageLoading } from "../Global"
import imgLogo from "../../assets/logo/logo.png"

import "./LoginPage.css"
import "./LoginPage-phone.css"

export default function LoginPage() {
    const Navigate = useNavigate()
    const Context = useContext(DataContext)

    useEffect(() => {
        document.title = "Вход | Ежиное-РП"
    }, [])

    const [errorText, seterrorText] = useState("") // Текст ошибки
    const [loginInputError, setloginInputError] = useState(false) // Отображать ли ошибку инпута логина
    const [passwordInputError, setpasswordInputError] = useState(false)  // Отображать ли ошибку инпута пароля
    const [disableSubmitButton, setdisableSubmitButton] = useState(false) // Отключить ли кнопку входа

    const loginInput = useRef()
    const passwordInput = useRef()

    

    // При обновлении любого из инпутов
    const handleInputUpdate = () => {
        seterrorText("")
        setloginInputError(false)
        setpasswordInputError(false)

        loginInput.current.value = loginInput.current.value.replaceAll(" ", "_")
        passwordInput.current.value = passwordInput.current.value.replaceAll(" ", "_")
    }

    // Ивент субмит у формы входа
    function loginForm(event) {
        // Отключение базового перехода
        event.preventDefault()

        handleInputUpdate() // Сброс всех ошибок

        let formLogin = loginInput.current.value
        let formPassword = passwordInput.current.value

        // Проверка длины логина
        if (formLogin.length < CONSTS.loginMin || formLogin.length > CONSTS.loginMax) {
            seterrorText(formLogin.length < CONSTS.loginMin
                ? `Логин меньше ${CONSTS.loginMin} символов`
                : `Логин больше ${CONSTS.loginMax} символов`
            )
            setloginInputError(true)
            return
        }

        // Проверка длины пароля
        if (formPassword.length < CONSTS.passwordMin || formPassword.length > CONSTS.passwordMax) {
            seterrorText(formPassword.length < CONSTS.passwordMin
                ? `Пароль меньше ${CONSTS.passwordMin} символов`
                : `Пароль больше ${CONSTS.passwordMax} символов`
            )
            setpasswordInputError(true)
            return
        }

        // Проверка наличия запрещенных символов
        let token = null
        try {
            token = btoa(formLogin + " " + formPassword)
        } catch {
            seterrorText("Неверный логин или пароль")
            setloginInputError(true)
            setpasswordInputError(true)
            return
        }

        // Отключаем кнопку только в случае если прошло все проверки
        setdisableSubmitButton(true)
        setPageLoading()

        GSAPI("authorize", {token: token}, (data) => {
            setPageLoading(false)

            // Если не нашло по токену
            if (!data.success || !Object.keys(data).length) {
                seterrorText("Неверный логин или пароль")
                setloginInputError(true)
                setpasswordInputError(true)
                setdisableSubmitButton(false)
                return
            }

            // Если успех - сохраняем и открываем главную
            let newUserData = data.data
            newUserData.token = token // Ставим токен
            localStorage.userData = JSON.stringify(newUserData)

            Context.setuserData(newUserData)
            Context.setisAdmin(newUserData.id === "291195777")
            Navigate("/")
            return
        })
    }

    return (
        <article id="article-login">
            <div className="section-login__logo">
                <img src={imgLogo} alt="logo" onClick={() => {Navigate("/")}} />
            </div>

            <section id="section-login">
                <form onSubmit={loginForm}>
                    <h2>Вход в профиль</h2>

                    <CustomInput label="Логин">
                        <input
                            ref={loginInput}
                            type="text"
                            id="form-login"
                            className={loginInputError ? "error" : null}
                            maxLength={CONSTS.loginMax}
                            onInput={handleInputUpdate}
                            required
                        />
                    </CustomInput>

                    <CustomInput label="Пароль" password={true}>
                        <input
                            ref={passwordInput}
                            type="password"
                            id="form-password"
                            className={passwordInputError ? "error" : null}
                            maxLength={CONSTS.passwordMax}
                            onInput={handleInputUpdate}
                            required
                        />
                    </CustomInput>

                    <p className={`text-red ${!errorText ? "hidden" : null}`}>{errorText}</p>

                    <button className="green" disabled={disableSubmitButton} type="submit">Войти</button>
                </form>
            </section>

            <div className="section-login__sub-text">
                <p><small className="text-gray">Нету аккаунта?</small></p>
                <Link to={"/registration"} className="text-link small">Зарегистрируйся!</Link>
            </div>
        </article>
    )
}