import { useEffect, useContext, useState } from "react"
import { DataContext } from "../Context"
import PostsRender from "../PostsRender/PostsRender"
import { GSAPI } from "../API";
import { setPageTitle } from "../Global"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgNews from "../../assets/icons/News.svg"

import "./NewsPage.css"
import "./NewsPage-phone.css"


export default function NewsPage() {
    useEffect(() => {setPageTitle("Новости")}, [])
    const Context = useContext(DataContext)


    const [disableLoadButton, setDisableLoadButton] = useState(false);
    const [showLoadButton, setShowLoadButton] = useState(true);

    let postsOffset = 0


    function loadMorePosts() {
        setDisableLoadButton(true)
        postsOffset += 10

        // Загрузка всех постов
        GSAPI("GETposts", {offset: postsOffset}, (data) => {
            console.log("GSAPI: GETposts offset=" + postsOffset);

            // После получения всех постов обновляем список в контексте
            let posts = [...Context.posts]
            Context.setPosts(posts.concat(data))

            // Если постов меньше 10 - не загружаем больше
            if (data.length < 10) {
                setShowLoadButton(false)
            }

            setDisableLoadButton(false)
        })
    }

    return (
        <article>
            <h4 className="page-title">h/news</h4>

            <PostsRender
                posts={Context.posts}
                users={Context.users}
            />

            {showLoadButton &&
                <section className="flex-col">
                    <ButtonImage
                        src={imgNews}
                        text={"Загрузить еще"}
                        width100
                        onClick={loadMorePosts}
                        disabled={disableLoadButton}
                    />
                </section>
            }
        </article>
    )
}
