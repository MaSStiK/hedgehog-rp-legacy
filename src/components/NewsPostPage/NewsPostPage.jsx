import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import PostsRender from "../PostsRender/PostsRender"
import { GSAPI } from "../API"
import { setPageTitle } from "../Global"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import imgNews from "../../assets/icons/News.svg"

import "./NewsPostPage.css"

export default function NewsPostPage() {
    useEffect(() => {setPageTitle("Новости")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()
    const URLparams = useParams()

    const [postData, setPostData] = useState([])
    const [postNotFound, setPostNotFound] = useState(false)

    useEffect(() => {
        // Загрузка постов по post_id
        GSAPI("GETpost", {post_id: URLparams.id}, (data) => {
            console.log("GSAPI: GETpost id=" + URLparams.id);

            // Если не найден пост - ошибка
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
            {Object.keys(postData).length && Context.users.length
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
                    {postNotFound
                        ? <section className="flex-col">
                            <h2>Пост не найдена!</h2>
                            <ButtonImage
                                src={imgNews}
                                text="Читать новости"
                                width100
                                onClick={() => Navigate("/news")}
                            />
                          </section>

                        // Предпоказ страницы
                        : <section className="flex-col post">
                            <div className="flex-row post__top">
                                <ButtonProfile text="LoremLoremCountry" preview />
                                <small className="text-gray">
                                    <small className="text-preview">xx.xx.xxxx</small>
                                    <br />
                                    <small className="text-preview">xx:xx</small>
                                </small>
                            </div>
                            <h3 className="text-preview">Lorem ipsum dolor sit amet.</h3>
                            <p>
                                <span className="text-preview">Lorem ipsum dolor sit.</span>
                                <br />
                                <span className="text-preview">Lorem ipsum dolor, sit amet consectetur adipisicing.</span>
                                <br />
                                <span className="text-preview">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deserunt architecto explicabo eos. Ratione hic accusamus itaque assumenda magnam, labore odit, quae repellendus eveniet voluptas, nostrum optio alias voluptates quis!</span>
                                <br />
                                <span className="text-preview">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit officiis numquam sit esse eligendi adipisci, facere vero voluptates suscipit, earum aliquid molestiae, accusamus hic voluptate fugiat?</span>
                                <br />
                                <span className="text-preview">¿Cómo estás?</span>
                            </p>
                          </section>
                    }
                </>
            }
        </article>
    )
}
