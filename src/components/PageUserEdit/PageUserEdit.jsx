import { useEffect, useContext, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"
import { setPageTitle } from "../Global"

import "./PageUserEdit.css"

export default function PageUserEdit() {
    useEffect(() => {setPageTitle("Изменение профиля")}, [])
    // const Context = useContext(DataContext)


    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title">/ Изменение профиля</h4>

                <section>
                    <h3>Скоро</h3>
                </section>
            </article>
        </>
    )
}
