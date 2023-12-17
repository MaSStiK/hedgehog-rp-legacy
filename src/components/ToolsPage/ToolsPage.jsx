import { useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"

import "./ToolsPage.css"

export default function ToolsPage(props) {
    const Navigate = useNavigate()
    const Context = useContext(DataContext)

    useEffect(() => {
        document.title = "Инструменты | Ежиное-РП"
    })

    const handleExitProfile = () => {
        localStorage.clear()
        Navigate("/")
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

            <article id="article-tools">
                <h4 className="page-title text-dark">/ Инструменты</h4>

                <section className="section-tools__column">
                    <h2>Запасной выход из профиля <br /><p>(Удаление всего хеша)</p></h2>
                    <p>Ссылка на функцию <br /><Link to={"exit"} className="text-link">{window.location.href + "/exit"}</Link></p>

                    <button className="red" onClick={handleExitProfile}>Выход из профиля</button>
                </section>
            </article>
        </>
    )
}
