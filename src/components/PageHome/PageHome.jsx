import { useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import Aside from "../Aside/Aside"
import PostsRender from "../PostsRender/PostsRender"

import "./PageHome.css"
import "./PageHome-phone.css"


export default function PageHome() {
    const Navigate = useNavigate()
    const Context = useContext(DataContext)

    useEffect(() => {
        document.title = "Главная | Ежиное-РП"
    })

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title text-dark">/ Главная</h4>

                <section className="flex-row">
                    <Link className="home__link-wrapper" to="https://vk.com/hedgehogs_army" target="_blank">
                        <img src="https://sun9-60.userapi.com/impg/oEWyVY7z0mShE_4NiWZjLJRUtlblNoS-p0Ph4Q/6rgXOaV54GI.jpg?size=1080x1021&quality=95&sign=7521bfdf054e784b2b37a022c4ec2fdf&type=album" alt="link-vk" />
                        <h3>Наша группа в ВК</h3>
                    </Link>

                    <Link className="home__link-wrapper" to="https://www.youtube.com/@hedgehogs_army" target="_blank">
                        <img src="https://sun9-75.userapi.com/impg/InAN-EkKVY2m_b5O35GiDeI1MEJDkpI6a8Rr4A/e6KrwnAUh-w.jpg?size=176x176&quality=96&sign=3c161604cc42ae88ab597906173bff60&type=album" alt="link-youtube" />
                        <h3>Мы в Youtube</h3>
                    </Link>
                </section>

                <section className="flex-col">
                    <h2>Последнее видео на канале</h2>

                    <iframe width="520" height="280" src="https://www.youtube.com/embed/niRy4Ygg7_g?si=CY2X1VXnpdn5SiW2" title="YouTube video player" frameBorder="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </section>

                <PostsRender posts={[...Context.posts].slice(0, 5)} users={Context.users} />

                <section>
                    <Link to={"/news"}>
                        <button>Больше новостей</button>
                    </Link>
                </section>
            </article>

            {/* Сделать квадрат с генерируемым текстом из нулей и единиц в буквы ("Скоро") */}
        </>
    )
}
