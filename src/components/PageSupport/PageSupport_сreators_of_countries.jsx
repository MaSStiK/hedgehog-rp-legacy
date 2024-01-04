import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Aside from "../Aside/Aside"
import CustomButton from "../CustomButton/CustomButton"


import "./PageSupport.css"

export default function Support_creators_of_countries() {
    const Navigate = useNavigate()

    useEffect(() => {
        document.title = "Помощь | Ежиное-РП"
    })

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title text-dark">/ Помощь</h4>

                <section className="flex-col">
                    <h3>Текстовый список создателей стран</h3>

                    <ul className="support__ul flex-col">
                        <li>Королевство Романья - <Link to={"https://vk.com/id535028784"} className="text-link" target="_blank">Алексей Ванжа</Link>
                            {" и "}
                            <Link to={"https://vk.com/id307642230"} className="text-link" target="_blank">Никита Ванжа</Link></li>
                        <li>Эллада - <Link to={"https://vk.com/id396771911"} className="text-link" target="_blank">Алексей Дедов</Link></li>
                        <li>Шлепляндия - <Link to={"https://vk.com/id291195777"} className="text-link" target="_blank">Мотя Овчинников</Link></li>
                        <li>Арбор - <Link to={"https://vk.com/id554225932"} className="text-link" target="_blank">Егор Полянский</Link></li>
                        <li>Регалия - <Link to={"https://vk.com/id636378157"} className="text-link" target="_blank">Ярослав Янченко</Link></li>
                        <li>Арабистон - <Link to={"https://vk.com/id554680398"} className="text-link" target="_blank">Ис Лам</Link></li>
                        <li>Сэнко - <Link to={"https://vk.com/id552376142"} className="text-link" target="_blank">’lmp ’pltnkv</Link></li>
                        <li>Членопопия - <Link to={"https://vk.com/id815686275"} className="text-link" target="_blank">Вася Иванов</Link></li>
                        <li>Орден Св. Арно - <Link to={"https://vk.com/id444733069"} className="text-link" target="_blank">Матвей Дорофеев</Link></li>
                        <li>Джейра - <Link to={"https://vk.com/id655062790"} className="text-link" target="_blank">Мари Писклова</Link></li>
                        <li>Пивград - <Link to={"https://vk.com/id523937758"} className="text-link" target="_blank">Дмитрий Паникаровский</Link></li>
                        <li>Фенмир, заморожен - <Link to={"https://vk.com/id610350669"} className="text-link" target="_blank">Fenet Greg</Link></li>
                        <li>Саптостан - <Link to={"https://vk.com/id450294430"} className="text-link" target="_blank">Тимофей Селетков</Link></li>
                    </ul>
                </section>
            </article>
        </>
    )
}
