import { useEffect } from "react"
import { Link } from "react-router-dom";
import { setPageTitle } from "../../Global"
import { SupportImg } from "../SupportElements"

import imgScreenshot1 from "../../../assets/support/Feedback/screenshot-1.png"
import imgScreenshot2 from "../../../assets/support/Feedback/screenshot-2.png"

import "../SupportPage.css"

export default function Feedback() {
    useEffect(() => {setPageTitle("Где можно опубликовать идеи или баги?")}, [])

    return (
        <article>
            <h4 className="page-title">h/support/feedback</h4>

            <section className="flex-col support-section">
                <h1>Где можно опубликовать идеи для сайта или отправить обнаруженные баги?</h1>
                <p>Чтобы оставить заявку, требуется выполнить вход или зарегистрироваться на платформе <Link className="text-link" to="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</Link>.</p>
                <p>После этого вы можете перейти в <Link className="text-link" to="https://github.com/MaSStiK/hedgehog-rp/issues" target="_blank" rel="noopener noreferrer">официальный репозиторий нашего веб-сайта</Link> на GitHub и там создать новую заявку.</p>
                <SupportImg src={imgScreenshot1} />
                <SupportImg src={imgScreenshot2} />
                <p>Ваша заявка будет рассмотрена в ближайшее время!</p>
            </section>
        </article>
    )
}
