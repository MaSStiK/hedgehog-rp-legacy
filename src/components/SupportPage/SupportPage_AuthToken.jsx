import { useEffect } from "react"
import { setPageTitle } from "../Global"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"

import "./SupportPage.css"

export default function SupportPageAuthToken() {
    useEffect(() => {setPageTitle("Помощь")}, [])

    return (
        <article>
            <h4 className="page-title">h/help/auth_token</h4>

            <section className="flex-col">
                <h1>Как использовать токен авторизации</h1>
                <p>После завершения процесса входа в ваш аккаунт или его регистрации, бот отправляет вам уведомление о успешной авторизации. В дополнение к этому, он передает вам "Токен авторизации", который можно скопировать и применить для входа в аккаунт на данном или другом устройстве.</p>
                <ImageFullscreen>
                    <img
                        src="https://sun9-47.userapi.com/impg/MIY1Ao_E5XVbkLcWG2_D7lhcqwcflnicsYYzfQ/jYkGl1VlIv8.jpg?size=525x171&quality=96&sign=231e223c1613d33400b63670f2604476&type=album"
                        alt="screenshot"
                        className="border-radius"
                        style={{border: "1px solid var(--border-primary)"}}
                    />
                </ImageFullscreen>
                
                <p>Эта функция предназначена для упрощения процесса авторизации: вместо повторной отправки кода боту пользователь может ввести специальный код один раз для доступа к аккаунту.</p>
            </section>
        </article>
    )
}
