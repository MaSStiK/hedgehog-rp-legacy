import { useEffect } from "react"
import { setPageTitle } from "../../Global"
import { SupportImg } from "../SupportElements"

import "../SupportPage.css"

const imgBasePath = "https://raw.githubusercontent.com/masstik/hedgehog-rp-assets/main/hedgehog-rp"
const imgScreenshot = imgBasePath + "/support/AuthToken/screenshot.png"

export default function AuthToken() {
    useEffect(() => {setPageTitle("Как использовать токен авторизации")}, [])

    return (
        <article>
            <h4 className="page-title">h/support/auth_token</h4>

            <section className="flex-col support-section">
                <h1>Как использовать токен авторизации</h1>
                <p>После завершения процесса входа в ваш аккаунт или его регистрации, бот отправляет вам уведомление о успешной авторизации. В дополнение к этому, он передает вам "Токен авторизации", который можно скопировать и применить для входа в аккаунт на данном или другом устройстве.</p>
                <SupportImg src={imgScreenshot} />
                <p>Эта функция предназначена для упрощения процесса авторизации: вместо повторной отправки кода боту пользователь может ввести специальный код один раз для доступа к аккаунту.</p>
            </section>
        </article>
    )
}
