import { useEffect } from "react"
import Aside from "../Aside/Aside"
import { setPageTitle } from "../Global"

import "./PageNotFound.css"

export default function PageNotFound() {
    useEffect(() => {setPageTitle("Ошибка")}, [])

    return (
        <>
            <Aside />
            
            <article>
                <h4 className="page-title">/ Ошибка</h4>

                <section>
                    <h2>Страница не найдена!</h2>
                </section>
            </article>
        </>
    )
}
