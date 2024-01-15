import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Aside from "../Aside/Aside"
import ButtonProfile from "../ButtonProfile/ButtonProfile"


import "./PageSupport.css"

export default function PageSupport() {
    const NavigateTo = useNavigate()

    useEffect(() => {
        document.title = "Помощь | Ежиное-РП"
    })

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title text-dark">/ Помощь</h4>

                <section className="flex-col">
                    <h3>Статьи для решения частых вопросов</h3>
                    
                    <Link to={"сreators-of-countries"}>
                        <ButtonProfile
                            text={"Текстовый список создателей стран"}
                        />
                    </Link>
                </section>
            </article>
        </>
    )
}