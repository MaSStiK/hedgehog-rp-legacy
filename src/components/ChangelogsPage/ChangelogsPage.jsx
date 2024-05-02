import { useEffect } from "react"
import { setPageTitle } from "../Global"
import ChangelogsRender from "./ChangelogsRender"
import changelogs from "./changelogs"


import "./ChangelogsPage.css"

export default function ChangelogsPage() {
    useEffect(() => {setPageTitle("Изменения")}, [])

    return (
        <article>
            <h4 className="page-title">h/changelogs</h4>

            <ChangelogsRender
                changelogs={changelogs}
            />
        </article>
    )
}