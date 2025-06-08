import { useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import PostsRender from "../PostsRender/PostsRender"
import PostPreview from "../PostPreview/PostPreview"
import { setPageTitle } from "../Global"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonToTop from "../ButtonToTop/ButtonToTop"
import HomeCalendar from "./HomeCalendar"

import imgNews from "../../assets/svg/News.svg"
import imgHomeAA from "../../assets/home/Home-Ace_Attorney.png"
import imgThumbnail from "../../assets/home/video-thumbnail.png"
import imgVk from "../../assets/vk.svg"
import imgYoutube from "../../assets/youtube.svg"

import imgUpdate from "../../assets/svg/Update.svg"
import ChangelogsRender from "../ChangelogsPage/ChangelogsRender"
import changelogs from "../ChangelogsPage/Changelogs"

import "./HomePage.css"
import "./HomePage-phone.css"

export default function HomePage() {
    useEffect(() => {setPageTitle("Главная")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()

    return (
        <article>
            <h4 className="page-title">h/home</h4>
            <ButtonToTop />

            <img className="home__image-AA" src={imgHomeAA} alt="Home-Ace_Attorney" draggable="false" />

            <HomeCalendar />

            <section className="flex-col">
                <h1>Последние новости</h1>
                {(Context.Posts.length && Context.Users.length)
                    ? <PostsRender
                        posts={[...Context.Posts].slice(0, 1)}
                        noSection
                      />
                    : <PostPreview noSection />
                }
                
                <ButtonImage
                    src={imgNews}
                    text="Читать новости"
                    title="Открыть страницу новостей"
                    width100
                    onClick={() => Navigate("/news")}
                />
            </section>

            <section className="flex-col">
                <h1>Новое видео на Ежином&nbsp;ТВ</h1>

                {/* <iframe width="520" height="280" src="https://www.youtube.com/embed/1yeE1jlYFnc?si=wsqkPsAl4VAA1FZm" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> */}
                
                <Link to="https://tv.hedgehog-rp.ru/watch/s4e14">
                    <img className="home__thumbnail" src={imgThumbnail} alt="thumbnail" />
                    <h3>4 сезон 14 серия | Предвоенный синдром</h3>
                </Link>
                
                <div className="flex-row flex-wrap">
                    <ButtonImage
                        className="tp no-filter"
                        src={imgVk}
                        alt="vk"
                        text="Группа в ВК"
                        title="Перейти к группе в ВК"
                        onClick={() => window.open("https://vk.com/hedgehogs_army", "_blank")}
                    />
                    <ButtonImage
                        className="tp no-filter"
                        src={imgYoutube}
                        alt="vk"
                        text="Канал на YouTube"
                        title="Перейти к каналу на YouTube"
                        onClick={() => window.open("https://www.youtube.com/@hedgehogs_army", "_blank")}
                    />
                </div>
            </section>

            <section className="flex-col">
                <h1>Обновления на сайте</h1>
                {(Context.Posts.length && Context.Users.length)
                    ? <ChangelogsRender
                        changelogs={[...changelogs].slice(0, 1)}
                        noSection
                      />
                    : <PostPreview noSection />
                }

                <ButtonImage
                    src={imgUpdate}
                    text="Все обновления"
                    title="Открыть страницу обновлений"
                    width100
                    onClick={() => Navigate("/changelogs")}
                />
            </section>
        </article>
    )
}
