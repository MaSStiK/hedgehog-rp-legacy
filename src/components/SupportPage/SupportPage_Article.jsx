import { useParams } from "react-router-dom"
import { articles } from "./SupportPage"

import "./SupportPage.css"

export default function SupportPage() {
    const URLparams = useParams()
    const article = articles.find(item => item.link === URLparams.id)

    // Если статья не найдена
    if (!article) {
        return (
            <article>
                <h4 className="page-title">h/support/{URLparams.id}</h4>

                <section>
                    <h1>Статья не найдена!</h1>
                </section>
            </article>
        )
    }

    // Если найдена - отображаем её
    const Component = article.component
    return (
        <Component />
    )
}