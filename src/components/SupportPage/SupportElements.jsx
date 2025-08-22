import $ from "jquery"

export function ScrollToTitle({ scrollTo, text }) {
    const scroll = (title) => { $("article").animate({scrollTop: $(`#${title}`).offset().top}, 100) }

    return (
        <li><span className="text-link" onClick={() => scroll(scrollTo)}>{text}</span></li>
    )
}