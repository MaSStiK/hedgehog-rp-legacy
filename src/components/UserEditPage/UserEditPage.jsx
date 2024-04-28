import { useEffect, useContext, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { DataContext } from "../Context"
import { setPageTitle } from "../Global"

import "./UserEditPage.css"

export default function UserEditPage() {
    useEffect(() => {setPageTitle("Изменение профиля")}, [])
    // const Context = useContext(DataContext)


    return (
        <article>
            <h4 className="page-title">h/user/edit</h4>

            <section>
                <h3>В разработке</h3>
            </section>
        </article>
    )
}
