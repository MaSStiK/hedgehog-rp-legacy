import { useRef, useEffect, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import ButtonImage from "../ButtonImage/ButtonImage"
import { CONFIG, setPageTitle, setPageLoading } from "../Global"
import AuthViaCode from "./authViaCode"
import AuthViaToken from "./authViaToken"
import imgLogo from "../../assets/logo/logoFullSize.png"
import imgCopy from "../../assets/icons/Copy.svg"
import imgLogin from "../../assets/icons/Login.svg"
import imgPaste from "../../assets/icons/Paste.svg"

import "./LoginPage.css"
import "./LoginPage-phone.css"

export default function LoginPage() {
    useEffect(() => {setPageTitle("Вход")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()

    // Уникальный ключ
    function generateVkCode() {
        return (Math.random().toString(32).substring(2) + Date.now().toString(32)).toUpperCase()
    }

    const [showCopyMessage, setShowCopyMessage] = useState(false) // Спрятать ли сообщение об скопированном коде

    const [vkCode] = useState(generateVkCode()) // Создаем ключ для отправки в вк (в state что бы при обновлении страницы не обновлялся код)

    const [errorCodeText, setErrorCodeText] = useState() // Отображать ли ошибку поиска юзера
    const [errorTokenText, setErrorTokenText] = useState() // Текст ошибки при входе через токен
    const [disableCodeButton, setDisableCodeButton] = useState(false)  // Состояние кнопки входа по коду
    const [disableTokenButton, setDisableTokenButton] = useState(true) // Состояние кнопки входа по токену

    const tokenInput = useRef()

    // При обновлении инпута с токеном
    function handleInputUpdate() {
        setErrorCodeText()
        setErrorTokenText()
        setDisableTokenButton(!tokenInput.current.value.length) // Если в поле с токеном 0 символов - ошибка
    }

    // Вход по коду
    function handleAuthViaCode() {
        setDisableCodeButton(true) // Отключаем кнопку во время проверки
        setErrorCodeText() // Убираем ошибку
        setPageLoading() // Ставим анимацию загрузки

        AuthViaCode(Context, vkCode) // Ищем пользователя который отправил код
        .then(() => { // Если успех
            setPageLoading(false)
            Navigate("/")
        })
        .catch(error => {  // Если произошла ошибка во время выполнения
            setErrorCodeText(error)
            setDisableCodeButton(false)
            setPageLoading(false)
        })
    }

    // Вход по токену
    function handleAuthViaToken() {
        handleInputUpdate() // Убираем ошибки
        setDisableTokenButton(true)
        setPageLoading()

        AuthViaToken(Context, tokenInput.current.value)
        .then(() => {
            setPageLoading(false)
            Navigate("/")
        })
        .catch(error => {
            setErrorTokenText(error)
            setDisableTokenButton(false)
            setPageLoading(false)
        })
    }

    return (
        <article id="article-login">
            <h4 className="page-title">h/login</h4>

            <div className="logo-wrapper">
                <img src={imgLogo} alt="logotype" onClick={() => {Navigate("/")}} draggable="false" />
            </div>

            <section>
                <h1>Вход в аккаунт</h1>
                <p>Для входа или регистрации отправьте код ниже <Link to={"https://vk.com/write-202912556"} target="_blank" className="text-link">нашему боту «Географ»</Link></p>

                <ButtonImage
                    className="tp"
                    src={imgCopy}
                    alt="copy-code"
                    text={vkCode}
                    onClick={() => {
                        navigator.clipboard.writeText(vkCode)
                        setShowCopyMessage(true)
                        setErrorCodeText()
                        setTimeout(() => setShowCopyMessage(false), 2000)
                    }}
                />
                {showCopyMessage && <p className="text-gray" style={{textAlign: "center"}}>Скопировано</p> }

                <small className="text-gray">
                    • Вы автоматически зарегистрируетесь, если у вас еще нет аккаунта<br />
                    • Не перезагружайте эту страницу во время отправки сообщения
                </small>
                <p>После отправки кода нажмите на кнопку</p>

                {errorCodeText && <p className="text-red" style={{textAlign: "center"}}>{errorCodeText}</p> }
                <button onClick={handleAuthViaCode} disabled={disableCodeButton}>Отправил</button>
                
                <hr />

                <p>Или введите актуальный токен авторизации, который вам отправлял бот</p>
                <Link className="login__link-support" to={"/support/auth-token"}>
                    <small className="text-gray link-image">Как использовать токен авторизации</small>
                </Link>

                <div className="login__token-row flex-row">
                    <CustomInput label="Токен авторизации" error={errorTokenText}>
                        <input
                            ref={tokenInput}
                            type="text"
                            id="form-code"
                            maxLength={CONFIG.AUTH_TOKEN_MAX}
                            onInput={handleInputUpdate}
                            required
                        />
                    </CustomInput>
                    <ButtonImage
                        src={imgPaste}
                        text="Вставить"
                        onClick={() => {
                            // Вставляем текст из буфера обмена
                            navigator.clipboard.readText()
                            .then(text => {
                                tokenInput.current.value = text
                                handleInputUpdate() // Обновляем инпуты
                            })
                        }}
                    />
                </div>
                {errorTokenText && <p className="text-red" style={{textAlign: "center"}}>{errorTokenText}</p> }

                <ButtonImage
                    src={imgLogin}
                    text="Войти"
                    onClick={handleAuthViaToken}
                    disabled={disableTokenButton}
                />
            </section>
        </article>
    )
}