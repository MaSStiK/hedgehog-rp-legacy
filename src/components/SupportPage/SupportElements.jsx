import Fullscreen from "../Fullscreen/Fullscreen"
import $ from "jquery"

export function ScrollToTitle({ scrollTo, text }) {
    const scroll = (title) => {
        $("article").animate({
            scrollTop: $(`#${title}`).offset().top - 12
        }, 100)
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