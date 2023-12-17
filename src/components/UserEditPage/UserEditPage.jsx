import { useEffect, useContext, useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"


import "./UserEditPage.css"

export default function UserEditPage() {
    // const Context = useContext(DataContext)
    // const Navigate = useNavigate()

    useEffect(() => {
        document.title = "Изменение страницы | Ежиное-РП"
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
            <Aside />

            <article id="article-user-edit">
                <section>
                    <h3>Скоро</h3>
                </section>
            </article>
        </>
    )
}
