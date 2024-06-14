import { useEffect } from "react"
import { Link } from "react-router-dom";
import { setPageTitle } from "../Global"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"

import "./SupportPage.css"

export default function SupportPageFeedback() {
    useEffect(() => {setPageTitle("Помощь")}, [])

    return (
        <article>
            <h4 className="page-title">h/support/feedback</h4>

            <section className="flex-col">
                <h1>Где можно опубликовать идеи для сайта и отправить обнаруженные баги?</h1>
                <p>Чтобы оставить заявку, требуется выполнить вход или зарегистрироваться на платформе <Link className="text-link" to="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</Link>.</p>
                <p>После этого вы можете перейти в <Link className="text-link" to="https://github.com/MaSStiK/hedgehog-rp/issues" target="_blank" rel="noopener noreferrer">официальный репозиторий нашего веб-сайта</Link> на GitHub и там создать новую заявку.</p>
                <ImageFullscreen>
                    <img
                        src="https://sun9-8.userapi.com/impg/cAgnm3exFo-1dY7ob_Z2oSZHZhLiNdNy6g3C0Q/JHpr9e2w7VE.jpg?size=1879x931&quality=96&sign=0074d1a9e9cca1105944293afaa8c545&type=album"
                        alt="screenshot"
                        className="border-radius"
                        style={{border: "1px solid var(--border-primary)", objectFit: "contain"}}
                    />
                </ImageFullscreen>
                <ImageFullscreen>
                    <img
                        src="https://sun9-71.userapi.com/impg/F0cYWdlp4y8mC8hSuz0y7AyWnToNBbUaPyBXAA/MI0dHyNdtp4.jpg?size=1879x931&quality=96&sign=17f31867852f52737396a64dde1825f2&type=album"
                        alt="screenshot"
                        className="border-radius"
                        style={{border: "1px solid var(--border-primary)", objectFit: "contain"}}
                    />
                </ImageFullscreen>
                <p>Ваша заявка будет рассмотрена в ближайшее время!</p>
            </section>
        </article>
    )
}
