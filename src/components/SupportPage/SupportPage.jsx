import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ButtonImage from "../ButtonImage/ButtonImage"
import { setPageTitle } from "../Global"

import AuthToken from "./Articles/AuthToken"
import Feedback from "./Articles/Feedback"
import RpLoreChapter1 from "./Articles/RpLoreChapter1"
import RpLoreChapter2 from "./Articles/RpLoreChapter2"
import RpLoreChapter3 from "./Articles/RpLoreChapter3"
import RpLoreChapter4 from "./Articles/RpLoreChapter4"
import RpLoreChapter5 from "./Articles/RpLoreChapter5"
import RpLoreChapter6 from "./Articles/RpLoreChapter6"

import imgInfo from "../../assets/svg/Info.svg"
import imgHelp from "../../assets/svg/Help.svg"

import "./SupportPage.css"

export const articles = [
    {title: "Где оставить обратную связь (идеи или баги)", icon: imgHelp, component: Feedback, link: "feedback"},
    {title: "Как использовать токен авторизации", icon: imgHelp, component: AuthToken, link: "auth_token"},
    {title: "История РП: Глава I - Кулсториробоб", icon: imgInfo, component: RpLoreChapter1, link: "rp_lore_chapter1"},
    {title: "История РП: Глава II - Лунная сторона Кулсториробоба", icon: imgInfo, component: RpLoreChapter2, link: "rp_lore_chapter2"},
    {title: "История РП: Глава III - Развязка", icon: imgInfo, component: RpLoreChapter3, link: "rp_lore_chapter3"},
    {title: "История РП: Глава IV - Планета Динахон Системы Базиликс", icon: imgInfo, component: RpLoreChapter4, link: "rp_lore_chapter4"},
    {title: "История РП: Глава V - Родной дом", icon: imgInfo, component: RpLoreChapter5, link: "rp_lore_chapter5"},
    {title: "История РП: Глава VI - Кассиопея - созвездие Единорога", icon: imgInfo, component: RpLoreChapter6, link: "rp_lore_chapter6"},
]

export function SupportPage() {
    useEffect(() => {setPageTitle("Помощь")}, [])
    const Navigate = useNavigate()

    return (
        <article>
            <h4 className="page-title">h/support</h4>

            <section className="flex-col">
                <h1>Статьи для решения проблем и вопросов</h1>
                {articles.map((article, i) => (
                    <ButtonImage
                        key={i}
                        src={article.icon}
                        text={article.title}
                        title={article.title}
                        width100
                        atStart
                        onClick={() => Navigate(article.link)}
                    />
                ))}
            </section>
        </article>
    )
}