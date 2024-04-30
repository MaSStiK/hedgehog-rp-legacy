import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { setPageTitle } from "../Global"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgLogout from "../../assets/icons/Logout.svg"

import "./ToolsPage.css"

export default function ToolsPage({
    doLogout,
    ...props
}) {
    useEffect(() => {setPageTitle("Инструменты")}, [])
    const NavigateTo = useNavigate()
    
    function logoutProfile() {
        localStorage.clear()
        NavigateTo("/")
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
