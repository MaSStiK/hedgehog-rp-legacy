import { useEffect, useContext, useState } from "react"
import { useParams } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"
import PostsRender from "../PostsRender/PostsRender"
import { GSAPI } from "../GS-API"


import "./PagePost.css"
import "./PagePost-phone.css"


export default function PagePost() {
    const Context = useContext(DataContext)
    const URLparams = useParams()

    // Переименовать в GETposts и сделать GETpost по URLparams.id

    useEffect(() => {
        document.title = "Новости | Ежиное-РП"
    })

    // const loadMorePosts = () => {

    //     // Загрузка всех новостей
    //     GSAPI("GETnews", {offset: postsOffset}, (data) => {
    //         console.log("GSAPI: GETnews offset=" + postsOffset);

    //         // После получения всех новостей обновляем список в контексте
    //         let posts = [...Context.posts]
    //         Context.setposts(posts.concat(data))

    //         // Если постов меньше 10 - не загружаем больше
    //         if (data.length < 10) {
    //             setshowLoadButton(false)
    //         }

    //         setdisableLoadButton(false)
    //     })
    // }

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title text-dark">/ Новости</h4>

                <PostsRender
                    posts={Context.posts}
                    users={Context.users}
                />

                {/* {showLoadButton &&
                    <section className="flex-col">
                        <button onClick={loadMorePosts} disabled={disableLoadButton}>Загрузить еще</button>
                    </section>
                } */}
            </article>
        </>
    )
}
