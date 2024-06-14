import { useEffect } from "react"
import { Link } from "react-router-dom"
import { setPageTitle, sortAlphabetically } from "../Global"

import "./SupportPage.css"

export default function SupportPageCreatorsList() {
    useEffect(() => {setPageTitle("Список создателей стран")}, [])

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
        <article>
            <h4 className="page-title">h/support/creators_list</h4>

            <section className="flex-col">
                <h1>Текстовый список создателей стран</h1>
                <p>(Не актуально)</p>

                <ul className="support__ul flex-col">
                    {sortAlphabetically(creators, "title").map((creator) => (
                        <li>
                            <p>{creator.title} - <Link to={"https://vk.com/id" + creator.id}
                                    className="text-link"
                                    target="_blank">{creator.name}
                                </Link>
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </article>
    )
}
