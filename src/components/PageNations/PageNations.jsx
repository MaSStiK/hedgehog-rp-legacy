import { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"
import { CONSTS } from "../Global"

import "./PageNations.css"

export default function PageNations() {
    const NavigateTo = useNavigate()
    const Context = useContext(DataContext)

    useEffect(() => {
        document.title = "Нации" + CONSTS.pageName
    })

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title text-dark">/ Нации</h4>

                <section className="flex-col">
                    <h3>Нации находятся под вопросом разработке</h3>
                    <p>Нужны ли они нам если почти все играют за людей?</p>
                </section>
            </article>
        </>
    )
}
