import { useContext } from "react"
import { DataContext } from "../Context"
import $ from "jquery"
import imgArrowUpBig from "../../assets/svg/Arrow-up.svg"

import "./ButtonToTop.css"

// Кнопка переносящая наверх страницы
export default function ButtonToTop({
    className=""
}) {
    const Context = useContext(DataContext)

    // Прокрутить Article в самый верх
    function toTop() {
        $("article").scrollTop(0)
    }

    // Если кнопка НЕ выключена
    if (Context.PageSettings["buttonToTop"] !== "false") {
        return (
            <button
                className={`tp button-toTop ${className}`}
                title="Наверх страницы"
                onClick={toTop} 
            >
                <img src={imgArrowUpBig} alt={"arrow-up"} draggable="false" />
            </button>
        )
    }

    return null
}