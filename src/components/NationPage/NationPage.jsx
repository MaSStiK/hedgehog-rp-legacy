import { useEffect } from "react"
import { setPageTitle } from "../Global"

import "./NationPage.css"

export default function NationPage() {
    useEffect(() => {setPageTitle("Нации")}, [])

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
