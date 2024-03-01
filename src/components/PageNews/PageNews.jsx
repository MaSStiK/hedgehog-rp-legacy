import { useEffect, useContext, useState } from "react"
import { useParams } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"
import PostsRender from "../PostsRender/PostsRender"
import { GSAPI } from "../API";
import { setPageTitle } from "../Global"

import "./PageNews.css"
import "./PageNews-phone.css"


export default function PageNews() {
    useEffect(() => {setPageTitle("Новости")}, [])
    const Context = useContext(DataContext)
    const URLparams = useParams()


    const [disableLoadButton, setdisableLoadButton] = useState(false);
    const [showLoadButton, setshowLoadButton] = useState(true);

    let postsOffset = 0


    function loadMorePosts() {
        setdisableLoadButton(true)
        postsOffset += 10

        // Загрузка всех постов
        GSAPI("GETposts", {offset: postsOffset}, (data) => {
            console.log("GSAPI: GETposts offset=" + postsOffset);

            // После получения всех постов обновляем список в контексте
            let posts = [...Context.posts]
            Context.setPosts(posts.concat(data))

            // Если постов меньше 10 - не загружаем больше
            if (data.length < 10) {
                setshowLoadButton(false)
            }

            setdisableLoadButton(false)
        })
    }

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title">/ Новости</h4>

                <PostsRender
                    posts={Context.posts}
                    users={Context.users}
                />

                {showLoadButton &&
                    <section className="flex-col">
                        <button onClick={loadMorePosts} disabled={disableLoadButton}>Загрузить еще</button>
                    </section>
                }
            </article>
        </>
    )
}
