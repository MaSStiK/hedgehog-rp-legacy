import { useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"

import "./PageNations.css"

export default function PageNations() {
    const NavigateTo = useNavigate()
    const Context = useContext(DataContext)

    useEffect(() => {
        document.title = "Нации | Ежиное-РП"
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
