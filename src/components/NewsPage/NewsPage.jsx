import { useEffect, useContext, useState } from "react"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"
import PostsRender from "../PostsRender/PostsRender"
import { GSAPI } from "../GS-API"


import "./NewsPage.css"
import "./NewsPage-phone.css"


export default function NewsPage() {
    const Context = useContext(DataContext)

    const [disableLoadButton, setdisableLoadButton] = useState(false);
    const [showLoadButton, setshowLoadButton] = useState(true);

    let postsOffset = 0

    useEffect(() => {
        document.title = "Новости | Ежиное-РП"
    })

    const loadMorePosts = () => {
        setdisableLoadButton(true)
        postsOffset += 10

        // Загрузка всех новостей
        GSAPI("GETnews", {offset: postsOffset}, (data) => {
            console.log("GSAPI: GETnews offset=" + postsOffset);

            // После получения всех новостей обновляем список в контексте
            let posts = [...Context.posts]
            Context.setposts(posts.concat(data))

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

            <article id="article-news">
                <h4 className="page-title text-dark">/ Новости</h4>

                <PostsRender posts={Context.posts} users={Context.users} />

                {showLoadButton &&
                    <section className="section-news__row">
                        <button onClick={loadMorePosts} disabled={disableLoadButton}>Загрузить еще</button>
                    </section>
                }
            </article>
        </>
    )
}
