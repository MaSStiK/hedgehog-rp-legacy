import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { setPageTitle } from "../Global"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgRosehip from "../../assets/images/Tools/rosehip.png"
import imgLogout from "../../assets/icons/Logout.svg"

import "./ToolsPage.css"

export default function ToolsPage({ doLogout }) {
    useEffect(() => {setPageTitle("Инструменты")}, [])
    const Navigate = useNavigate()
    
    function logoutProfile() {
        localStorage.clear()
        Navigate("/")
        window.location.reload()
    }

    // Если переход с ссылки на выход из профиля
    useEffect(() => {
        if (doLogout) {
            logoutProfile()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href])

    return (
        <article>
            <h4 className="page-title">h/tools</h4>

            <section className="flex-col">
                <h1>Шиповник <small className="text-gray">(feat. Даня)</small></h1>
                <ButtonImage
                    src={imgRosehip}
                    text="Список Шиповника"
                    onClick={() => Navigate("./rosehip")}
                />
            </section>

            <section className="flex-col">
                <h3>Запасной выход из профиля <br/><p className="text-gray">(Удаление всего хеша)</p></h3>
                <p>Ссылка на функцию <br/><Link to={"exit"} className="text-link">{window.location.href + "/exit"}</Link></p>
                <ButtonImage
                    src={imgLogout}
                    text="Выход из профиля"
                    className="red"
                    onClick={logoutProfile}
                />
            </section>
        </article>
    )
}
