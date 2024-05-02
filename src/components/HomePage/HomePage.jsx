import { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import PostsRender from "../PostsRender/PostsRender"
import { setPageTitle } from "../Global"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgNews from "../../assets/icons/News.svg"
import imgHomeAA from "../../assets/images/Home-Ace_Attorney.png"
import imgVk from "../../assets/images/vk.svg"
import imgYoutube from "../../assets/images/youtube.svg"

import imgUpdate from "../../assets/icons/Update.svg"
import ChangelogsRender from "../ChangelogsPage/ChangelogsRender"
import changelogs from "../ChangelogsPage/changelogs"


import "./HomePage.css"
import "./HomePage-phone.css"


export default function HomePage() {
    useEffect(() => {setPageTitle("Главная")}, [])
    const NavigateTo = useNavigate()
    const Context = useContext(DataContext)

    return (
        <article>
            <h4 className="page-title">h/home</h4>

            <img className="home__image-AA" src={imgHomeAA} alt="Home-Ace_Attorney" draggable="false" />
            <section className="flex-col">
                <h1>Новое видео на канале</h1>
                <iframe width="520" height="280" src="https://www.youtube.com/embed/x2gx7yKC54s?si=DUBOXLomABWx7FLY" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                <div className="flex-row" style={{flexWrap: "wrap"}}>
                    <ButtonImage
                        className="tp"
                        src={imgVk}
                        alt="vk"
                        text="Группа в ВК"
                        onClick={() => window.open("https://vk.com/hedgehogs_army", "_blank")}
                    />
                    <ButtonImage
                        className="tp"
                        src={imgYoutube}
                        alt="vk"
                        text="Канал на YouTube"
                        onClick={() => window.open("https://www.youtube.com/@hedgehogs_army", "_blank")}
                    />
                </div>
            </section>

            {/* Отображаем последнюю новость и обновление после загрузки */}
            {Context.posts.length
                ? <>
                    <section className="home__post flex-col">
                        <h1>Самое актуальное</h1>
                        <PostsRender
                            posts={[...Context.posts].slice(0, 1)}
                            users={Context.users}
                        />
                        <ButtonImage
                            src={imgNews}
                            text="Читать новости"
                            width100
                            onClick={() => NavigateTo("/news")}
                        />
                    </section>

                    <section className="home__post flex-col">
                        <h1>Новое на сайте</h1>
                        <ChangelogsRender
                            changelogs={[...changelogs].slice(0, 1)}
                        />
                        <ButtonImage
                            src={imgUpdate}
                            text="Все обновления"
                            width100
                            onClick={() => NavigateTo("/changelogs")}
                        />
                    </section>
                  </>
                : null
            }
        </article>
    )
}
