import { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import { setPageTitle } from "../Global"

import "./NationPage.css"

export default function NationPage() {
    useEffect(() => {setPageTitle("Нации")}, [])
    const NavigateTo = useNavigate()
    const Context = useContext(DataContext)

    return (
        <article>
            <h4 className="page-title">h/nation</h4>

            <section className="flex-col">
                <h3>Нации находятся под вопросом разработке</h3>
                <p>Нужны ли они нам если почти все играют за людей?</p>
            </section>
        </article>
    )
}
