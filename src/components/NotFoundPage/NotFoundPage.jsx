import { useEffect } from "react"
import { setPageTitle } from "../Global"

import "./NotFoundPage.css"

export default function NotFoundPage() {
    useEffect(() => {setPageTitle("Ошибка")}, [])

    return (
        <article>
            <h4 className="page-title">h/error404</h4>

            <section>
                <h1>Страница не найдена!</h1>
            </section>
        </article>
    )
}
