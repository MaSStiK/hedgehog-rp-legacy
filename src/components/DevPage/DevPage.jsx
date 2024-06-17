import { useState, useEffect, useRef, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import { CONFIG, setPageTitle, setPageLoading } from "../Global"
import { GSAPI } from "../API";
import AdminAuthViaToken from "./AdminAuthViaToken"
import CustomInput from "../CustomInput/CustomInput"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ButtonImage from "../ButtonImage/ButtonImage"

import imgHome from "../../assets/svg/Home.svg"
import imgSearch from "../../assets/svg/Search.svg"
import imgTool from "../../assets/svg/Tool.svg"
import imgAt from "../../assets/svg/At.svg"
import imgProfileBase from "../../assets/replace/profile-base.png"

import imgLogo from "../../assets/logo/logoFullSize.png"
import imgCopy from "../../assets/svg/Copy.svg"
import imgLogin from "../../assets/svg/Login.svg"
import imgPaste from "../../assets/svg/Paste.svg"

import "./DevPage.css"

export default function DevPage() {
    useEffect(() => {setPageTitle("dev")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()

    // useEffect(() => {
    //     console.log("GETevent");
    //     GSAPI("GETevent", {}, (data) => {
    //         console.log(data);
    //     })
    // })

    function openModal(data) {
        Context.setModal(
            <div style={{height: "var(--modal-height-max)", overflow: "auto", padding: "var(--gap-small)"}}>
                <p>{JSON.stringify(data, false, 4)}</p>
            </div>
        )
    }

    const [errorTokenText, setErrorTokenText] = useState() // Текст ошибки при входе через токен
    const [disableTokenButton, setDisableTokenButton] = useState(true) // Состояние кнопки входа по токену

    const tokenInput = useRef()

    // При обновлении инпута с токеном
    function handleInputUpdate() {
        setErrorTokenText()
        setDisableTokenButton(!tokenInput.current.value.length) // Если в поле с токеном 0 символов - ошибка
    }

    // Вход по токену
    function handleAuthViaToken() {
        handleInputUpdate() // Убираем ошибки
        setDisableTokenButton(true)
        setPageLoading()

        AdminAuthViaToken(Context, tokenInput.current.value)
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
        <article>
            <h4 className="page-title">h/dev</h4>

            <section className="flex-col">
                <h1>Вход в аккаунт <span className="p text-gray">Без уведомления</span></h1>

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
                        title="Вставить токен"
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
                    title="Войти в аккаунт"
                    width100
                    onClick={handleAuthViaToken}
                    disabled={disableTokenButton}
                />
            </section>

            <section className="flex-col">
                <h1>Новость из сообщения в ВК <span className="p text-gray">Из любого</span></h1>
                <ButtonImage
                    src={imgSearch}
                    alt="find"
                    text="Найти сообщение"
                    title="Перейти к поиску сообщений"
                    width100
                    onClick={() => Navigate("/tools/find-message", {state: {noFilter: true}})}
                />
            </section>
            
            {/* Полезные кнопки */}
            <section className="flex-col">
                <div className="flex-row flex-wrap">
                    <ButtonImage
                        src={imgTool}
                        alt="button-test"
                        text="Context"
                        title="Context"
                        className="green"
                        onClick={() => openModal(Context)}
                    />
                    <ButtonImage
                        src={imgTool}
                        alt="button-test"
                        text="Context.UserData"
                        title="Context.UserData"
                        className="green"
                        onClick={() => openModal(Context.UserData)}
                    />
                    <ButtonImage
                        src={imgTool}
                        alt="button-test"
                        text="Context.PageSettings"
                        title="Context.PageSettings"
                        className="green"
                        onClick={() => openModal(Context.PageSettings)}
                    />
                </div>

                <ButtonImage
                    src={imgTool}
                    alt="button-test"
                    text="dev/elements"
                    title="dev/elements"
                    className="green"
                    onClick={() => Navigate("/dev/elements")}
                />
            </section>
        </article>
    )
}