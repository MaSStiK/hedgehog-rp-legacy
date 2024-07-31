import { useEffect, useContext } from "react"
import { setPageTitle } from "../Global"
import { DataContext } from "../Context"
import PostPreview from "../PostPreview/PostPreview"
import ButtonToTop from "../ButtonToTop/ButtonToTop"
import ChangelogsRender from "./ChangelogsRender"
import Changelogs from "./Changelogs"


import "./ChangelogsPage.css"

export default function ChangelogsPage() {
    useEffect(() => {setPageTitle("Изменения")}, [])
    const Context = useContext(DataContext)

    return (
        <article>
            <h4 className="page-title">h/changelogs</h4>
            <ButtonToTop />

            {/* Отображаем обновления когда пользователи и посты */}
            {(Context.Users.length && Context.Posts.length)
                ? <ChangelogsRender
                    changelogs={Changelogs}
                />

                : <>
                    <PostPreview />
                    <PostPreview />
                    <PostPreview />
                  </>
            }
        </article>
    )
}