import { useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"

import "./PageNations.css"

export default function PageNations() {
    const Navigate = useNavigate()
    const Context = useContext(DataContext)

    useEffect(() => {
        document.title = "Инструменты | Ежиное-РП"
    })

    return (
        <>
            <Aside />

            <article id="article-nations">
                <h4 className="page-title text-dark">/ Инструменты</h4>

                <section className="section-nations__column">
                    <h3>Нации находятся под вопросом разработке</h3>
                    <p>Нужны ли они нам если почти все играют за людей?</p>
                </section>
            </article>
        </>
    )
}
