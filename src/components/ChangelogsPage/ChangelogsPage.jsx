import { useEffect, useContext } from "react"
import { setPageTitle } from "../Global"
import { DataContext } from "../Context"
import ChangelogsRender from "./ChangelogsRender"
import changelogs from "./changelogs"


import "./ChangelogsPage.css"

export default function ChangelogsPage() {
    useEffect(() => {setPageTitle("Изменения")}, [])
    const Context = useContext(DataContext)

    return (
        <article>
            <h4 className="page-title">h/changelogs</h4>

            {Context.posts.length && Context.users.length
                ? <ChangelogsRender
                    changelogs={changelogs}
                  />
                : null
            }
        </article>
    )
}