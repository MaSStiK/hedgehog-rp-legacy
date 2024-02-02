import { useEffect, useContext, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"
import PostsRender from "../PostsRender/PostsRender"
import { GSAPI } from "../GS-API"
import { CONSTS } from "../Global"

import "./PageNewsPost.css"
import "./PageNewsPost-phone.css"


export default function PageNewsPost() {
    const Context = useContext(DataContext)
    const URLparams = useParams()

    const [postData, setpostData] = useState([]);
    const [postNotFound, setpostNotFound] = useState(false);

    useEffect(() => {
        document.title = "Новости" + CONSTS.pageName
    })

    useEffect(() => {
        // Загрузка постов по post_id
        GSAPI("GETpost", {post_id: URLparams.id}, (data) => {
            console.log("GSAPI: GETpost id=" + URLparams.id);

            // Если не найден пост не уникальный
            if (!data.success || !Object.keys(data).length) {
                setpostNotFound(true)
                return
            }

            setpostData([data.data])
        })
    }, [URLparams.id]);

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title text-dark">/ Новости</h4>

                {/* Если пост найден */}
                {Object.keys(postData).length
                    ? <>
                        <PostsRender
                            posts={postData}
                            users={Context.users}
                        />

                        <section className="flex-col">
                            <Link to={"/news"}>
                                <button>К новостям</button>
                            </Link>
                        </section>
                    </>
                    
                    
                    // Если пост не найден, будет показан только когда будет ошибка
                    : <> 
                        {postNotFound &&
                            <section className="flex-col">
                                <h2>Новость не найдена!</h2>
                                <Link to={"/news"}>
                                    <button>К новостям</button>
                                </Link>
                            </section>
                        }
                    </>
                }
            </article>
        </>
    )
}
