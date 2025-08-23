import Fullscreen from "../Fullscreen/Fullscreen"
import $ from "jquery"

export function ScrollToTitle({ scrollTo, text }) {
    const PaddingTop = 12 // отступ сверху от секции при прокрутке
    const ScrollSpeed = 100 // Скорость прокрутки
    const scroll = (title) => {
        $("article").animate({
            scrollTop: $(`#${title}`).offset().top - PaddingTop
        }, ScrollSpeed)
    }

    return (
        <li><span className="text-link" onClick={() => scroll(scrollTo)}>{text}</span></li>
    )
}

export function SupportImg({ src }) {
    return (
        <Fullscreen>
            <img
                src={src}
                alt="article-img"
                className="support-img"
            />
        </Fullscreen>
    )
}