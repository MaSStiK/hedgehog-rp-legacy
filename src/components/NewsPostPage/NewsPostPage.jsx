import { useEffect, useContext, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import PostsRender from "../PostsRender/PostsRender"
import { GSAPI } from "../API"
import { setPageTitle } from "../Global"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgNews from "../../assets/icons/News.svg"

import "./NewsPostPage.css"
import "./NewsPostPage-phone.css"


export default function NewsPostPage() {
    useEffect(() => {setPageTitle("Новости")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()
    const URLparams = useParams()

    const [postData, setPostData] = useState([]);
    const [postNotFound, setPostNotFound] = useState(false);

    useEffect(() => {
        // Загрузка постов по post_id
        GSAPI("GETpost", {post_id: URLparams.id}, (data) => {
            console.log("GSAPI: GETpost id=" + URLparams.id);

            // Если не найден пост не уникальный
            if (!data.success || !Object.keys(data).length) {
                setPostNotFound(true)
                return
            }

            setPostData([data.data])
        })
    }, [URLparams.id]);

    return (
        <article>
            <h4 className="page-title">h/news</h4>

            {/* Если пост найден */}
            {Object.keys(postData).length
                ? <>
                    <PostsRender
                        posts={postData}
                    />

                    <section className="flex-col">
                        <ButtonImage
                            src={imgNews}
                            text="Читать новости"
                            width100
                            onClick={() => Navigate("/news")}
                        />
                    </section>
                </>
                
                
                // Если пост не найден, будет показан только когда будет ошибка
                : <> 
                    {postNotFound &&
                        <section className="flex-col">
                            <h2>Новость не найдена!</h2>
                            <ButtonImage
                                src={imgNews}
                                text="Читать новости"
                                width100
                                onClick={() => Navigate("/news")}
                            />
                        </section>
                    }
                </>
            }
        </article>
    )
}
