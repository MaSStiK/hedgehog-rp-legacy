import { useEffect } from "react"
import Aside from "../Aside/Aside"

import "./PageNotFound.css"

export default function PageNotFound() {
    useEffect(() => {
        document.title = "Ошибка | Ежиное-РП"
    }, [])

    return (
        <>
            <Aside />
            
            <article>
                <h4 className="page-title text-dark">/ Ошибка</h4>

                <section>
                    <h2>Страница не найдена!</h2>
                </section>
            </article>
        </>
    )
}
