import { useEffect, useContext, useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"
import { CONSTS } from "../Global"

import "./PageUserEdit.css"

export default function PageUserEdit() {
    // const Context = useContext(DataContext)
    const NavigateTo = useNavigate()

    useEffect(() => {
        document.title = "Изменение профиля" + CONSTS.pageName
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title text-dark">/ Изменение профиля</h4>

                <section>
                    <h3>Скоро</h3>
                </section>
            </article>
        </>
    )
}
