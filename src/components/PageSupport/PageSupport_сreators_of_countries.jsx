import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Aside from "../Aside/Aside"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { sortAlphabetically } from "../Global"



import "./PageSupport.css"

export default function Support_creators_of_countries() {
    const NavigateTo = useNavigate()

    useEffect(() => {
        document.title = "Помощь | Ежиное-РП"
    })

    const creators = [
        {title: "Эллада", id: 396771911, name: "Алексей Дедов"},
        {title: "Ежиное Царство" , id: 465908082, name: "Даниил Вудергорский"},
        {title: "Шлёпляндия", id: 291195777, name: "Мотя Овчинников"},
        {title: "Арбор", id: 554225932, name: "Егор Полянский"},
        {title: "Регалия", id: 636378157, name: "Ярослав Янченко"},
        {title: "Арабистон", id: 554680398, name: "Ис Лам"},
        {title: "Сэнко и Членопопия" , id: 552376142, name: "’lmp ’pltnkv"},
        {title: "Орден Св. Арно" , id: 444733069, name: "Матвей Дорофеев"},
        {title: "Джейра", id: 655062790, name: "Мари Писклова"},
        {title: "Пивград", id: 523937758, name: "Дмитрий Паникаровский"},
        {title: "Фенмир (заморожен)", id: 610350669, name: "Fenet Greg"},
        {title: "Саптостан", id: 450294430, name: "Тимофей Селетков"},
        {title: "Мяуляндия", id: 4771941180, name: "Владислав Ермошкин"},
        {title: "Морейская Империя" , id: 616625513, name: "Иван Кравцов"},
        {title: "Валор", id: 509579665, name: "Вова Шацкий"},
    ]

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title text-dark">/ Помощь</h4>

                <section className="flex-col">
                    <h3>Текстовый список создателей стран</h3>

                    <ul className="support__ul flex-col">
                        {sortAlphabetically(creators, "title").map((creator) => (
                            <li><p>{creator.title} - <Link to={"https://vk.com/id" + creator.id} className="text-link" target="_blank">{creator.name}</Link></p></li>
                        ))}
                    </ul>
                </section>
            </article>
        </>
    )
}
