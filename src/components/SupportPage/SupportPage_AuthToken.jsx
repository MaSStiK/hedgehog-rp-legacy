import { useEffect } from "react"
import { setPageTitle } from "../Global"
import Fullscreen from "../Fullscreen/Fullscreen"

import imgScreenshot from "../../assets/support/AuthToken/screenshot.png"

import "./SupportPage.css"

export default function SupportPageAuthToken() {
    useEffect(() => {setPageTitle("Помощь")}, [])

    return (
        <article>
            <h4 className="page-title">h/support/auth_token</h4>

            <section className="flex-col">
                <h1>Как использовать токен авторизации</h1>
                <p className="text-light">После завершения процесса входа в ваш аккаунт или его регистрации, бот отправляет вам уведомление о успешной авторизации. В дополнение к этому, он передает вам "Токен авторизации", который можно скопировать и применить для входа в аккаунт на данном или другом устройстве.</p>
                <Fullscreen>
                    <img
                        src={imgScreenshot}
                        alt="screenshot"
                        className="border-radius"
                        style={{border: "1px solid var(--border-primary)"}}
                    />
                </Fullscreen>
                
                <p className="text-light">Эта функция предназначена для упрощения процесса авторизации: вместо повторной отправки кода боту пользователь может ввести специальный код один раз для доступа к аккаунту.</p>
            </section>
        </article>
    )
}
