import { useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"

import "./PageTools.css"

export default function PageTools(props) {
    const NavigateTo = useNavigate()
    const Context = useContext(DataContext)

    useEffect(() => {
        document.title = "Инструменты | Ежиное-РП"
    })

    const handleExitProfile = () => {
        localStorage.clear()
        NavigateTo("/home")
        window.location.reload()
    }

    useEffect(() => {
        if (props.doExit) {
            handleExitProfile()
        }
    }, [window.location.href])

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title text-dark">/ Инструменты</h4>

                <section className="flex-col">
                    <h3>Запасной выход из профиля <br /><p>(Удаление всего хеша)</p></h3>
                    <p>Ссылка на функцию <br /><Link to={"exit"} className="text-link">{window.location.href + "/exit"}</Link></p>
                    <button className="red" onClick={handleExitProfile}>Выход из профиля</button>
                </section>

                <section className="flex-col">
                    <h3>Сервис для сокращения ссылок</h3>
                    <Link to={"https://is.gd"} target="_blank" className="text-link">https://is.gd</Link>
                </section>
            </article>
        </>
    )
}
