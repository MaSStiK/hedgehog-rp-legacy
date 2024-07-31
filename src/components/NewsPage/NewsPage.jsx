import { useEffect, useContext, useState } from "react"
import { DataContext } from "../Context"
import PostsRender from "../PostsRender/PostsRender"
import PostPreview from "../PostPreview/PostPreview"
import { GSAPI } from "../API";
import { CONFIG, setPageTitle } from "../Global"
import ButtonToTop from "../ButtonToTop/ButtonToTop"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgNews from "../../assets/svg/News.svg"

import "./NewsPage.css"
import "./NewsPage-phone.css"

export default function NewsPage() {
    useEffect(() => {setPageTitle("Новости")}, [])
    const Context = useContext(DataContext)

    const [disableLoadButton, setDisableLoadButton] = useState(false)
    const [showLoadButton, setShowLoadButton] = useState(true)

    // Загрузка постов по offset
    function loadMorePosts() {
        setDisableLoadButton(true)
        GSAPI("GETposts", {offset: Context.PostsOffset + CONFIG.POSTS_AMOUNT, amount: CONFIG.POSTS_AMOUNT}, (data) => {
            console.log("GSAPI: GETposts offset=" + (Context.PostsOffset + CONFIG.POSTS_AMOUNT))

            Context.setPostsOffset(Context.PostsOffset + CONFIG.POSTS_AMOUNT)
    
            // После получения всех постов обновляем общий список в контексте
            let posts = [...Context.Posts]
            Context.setPosts(posts.concat(data.posts))
    
            // Если вернул remain: false - прячем кнопку
            if (!data.remain) setShowLoadButton(false) 
            setDisableLoadButton(false)
        })
    }

    return (
        <article>
            <h4 className="page-title">h/news</h4>
            <ButtonToTop />

            {/* Отображаем обновления когда пользователи и посты */}
            {(Context.Users.length && Context.Posts.length)
                ? <PostsRender
                    posts={Context.Posts.sort((a, b) => b.timestamp - a.timestamp)}
                  />

                : <>
                    <PostPreview />
                    <PostPreview />
                    <PostPreview />
                  </>
            }

            {showLoadButton &&
                <section className="flex-col">
                    <ButtonImage
                        src={imgNews}
                        text="Загрузить еще"
                        title="Загрузить больше новостей"
                        width100
                        onClick={loadMorePosts}
                        disabled={disableLoadButton}
                    />
                </section>
            }
        </article>
    )
}