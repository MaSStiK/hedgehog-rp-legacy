import { useEffect } from "react"
import { Link } from "react-router-dom";
import { setPageTitle } from "../../Global"
import Fullscreen from "../../Fullscreen/Fullscreen"

import imgScreenshot1 from "../../../assets/support/Feedback/screenshot-1.png"
import imgScreenshot2 from "../../../assets/support/Feedback/screenshot-2.png"

import "../SupportPage.css"

export default function Feedback() {
    useEffect(() => {setPageTitle("Помощь")}, [])

    return (
        <article>
            <h4 className="page-title">h/support/feedback</h4>

            <section className="flex-col">
                <h1>Где можно опубликовать идеи для сайта или отправить обнаруженные баги?</h1>
                <p className="text-light">Чтобы оставить заявку, требуется выполнить вход или зарегистрироваться на платформе <Link className="text-link" to="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</Link>.</p>
                <p className="text-light">После этого вы можете перейти в <Link className="text-link" to="https://github.com/MaSStiK/hedgehog-rp/issues" target="_blank" rel="noopener noreferrer">официальный репозиторий нашего веб-сайта</Link> на GitHub и там создать новую заявку.</p>
                <Fullscreen>
                    <img
                        src={imgScreenshot1}
                        alt="screenshot"
                        className="support-img"
                    />
                </Fullscreen>
                <Fullscreen>
                    <img
                        src={imgScreenshot2}
                        alt="screenshot"
                        className="support-img"
                    />
                </Fullscreen>
                <p className="text-light">Ваша заявка будет рассмотрена в ближайшее время!</p>
            </section>
        </article>
    )
}
