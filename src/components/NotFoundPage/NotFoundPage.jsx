import { useEffect } from "react"
import Aside from "../Aside/Aside"

import "./NotFoundPage.css"

export default function NotFoundPage() {
    useEffect(() => {
        document.title = "Ошибка | Ежиное-РП"
    }, [])

    return (
        <>
            <Aside />
            
            <article id="article-notfound">
                <h4 className="page-title text-dark">/ Ошибка</h4>

                <section>
                    <h2>Страница не найдена, или ее еще не сделали</h2>
                </section>
            </article>
        </>
    )
}
