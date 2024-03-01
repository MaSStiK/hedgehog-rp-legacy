import { useEffect } from "react"
import { Link } from "react-router-dom"
import Aside from "../Aside/Aside"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { setPageTitle } from "../Global"

import "./PageSupport.css"

export default function PageSupport() {
    useEffect(() => {setPageTitle("Помощь")}, [])

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title">/ Помощь</h4>

                <section className="flex-col">
                    <h3>Статьи для решения частых вопросов</h3>
                    
                    <Link to={"creators-of-countries"}>
                        <ButtonProfile
                            text={"Текстовый список создателей стран"}
                        />
                    </Link>
                </section>
            </article>
        </>
    )
}