import { useEffect, useContext, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { setPageTitle } from "../Global"
import { CountryPostsLoad, PostsObjectToArray } from "./CountryPostsLoad"
import Fullscreen from "../Fullscreen/Fullscreen"
import ButtonToTop from "../ButtonToTop/ButtonToTop"
import PostsRender from "../PostsRender/PostsRender"
import imgBasePhoto from "../../assets/replace/photo-empty.png"
import imgEdit from "../../assets/svg/Edit.svg"
import imgAdd from "../../assets/svg/Plus.svg"
import imgCopy from "../../assets/svg/Copy.svg"
import imgCountry from "../../assets/svg/Country.svg"

import "./CountryPage.css"
import "./CountryPage-phone.css"

export default function CountryPage() {
    useEffect(() => {setPageTitle("Страна")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()
    const URLparams = useParams()

    // Отображается ли страна авторизованного, если нету данных о входе - автоматически false
    const isSelfRender = Context.UserData ? Context.UserData?.country_id === URLparams.id : false

    const [countryNotFound, setCountryNotFound] = useState(false)
    const [showCopyMessage, setShowCopyMessage] = useState(false) // Сообщение о скопированном теге
    const [showPreload, setShowPreload] = useState(true) // Прелоад
    const [renderPosts, setRenderPosts] = useState([]) // Посты страны
    const [userData, setUserData] = useState({}) // Найденная информация о стране (Внутри информации пользователя)

    function CopyTag() {
        navigator.clipboard.writeText(userData.country_tag)
        setShowCopyMessage(true)
        setTimeout(() => setShowCopyMessage(false), 2000)
    }

    // Когда загрузились все юзеры
    useEffect(() => {
        // Если профиль еще не загрузились - не отображаем
        if (!Context.Users.length || !Context.Posts.length) return
        
        // Поиск пользователя по id
        let foundUser = Context.Users.find(user => user.id === URLparams.id.slice(1))
        if (!foundUser || !foundUser.country_id) {
            setCountryNotFound(true)
            setUserData({})
            setPageTitle("Страна не найдена")
            return
        }

        setUserData(foundUser)
        setPageTitle(foundUser.country_name)
        setRenderPosts(PostsObjectToArray(Context.CountryPosts[URLparams.id])) // Первичный рендер постов которые загрузились вместе со всеми постами

        // Загрузка постов страны
        CountryPostsLoad(Context, 0, URLparams.id)
        .then(postsArray => {
            setRenderPosts(postsArray)
            setShowPreload(false)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [URLparams.id, Context.Users, Context.Posts])

    return (
        <article>
            <h4 className="page-title">{`h/country/${URLparams.id}`}</h4>
            <ButtonToTop />

            {/* Если страна найдена */}
            {Object.keys(userData).length
                ? <>
                    <section className="flex-col">
                        <div className="country-page__top">
                            <div className="country-page__top-photo">
                                <Fullscreen>
                                    <img src={userData.country_photo ? userData.country_photo : imgBasePhoto} alt="country-profile" draggable="false" />
                                </Fullscreen>
                            </div>
                            <div className="country-page__top-name">
                                <h2>{userData.country_name}</h2>
                                <div className="country-page__top-tag flex-row" onClick={CopyTag}>
                                    <img className="image-gray" src={imgCopy} alt="copy-tag" draggable="false" />
                                    <p className="text-cut text-gray">{showCopyMessage ? "Скопировано" : userData.country_tag}</p>
                                </div>
                            </div>
                        </div>

                        {/* Кнопка редактирования страны если отображается страна владельца */}
                        {isSelfRender &&
                            <div className="country-page__buttons flex-row">
                                <ButtonImage
                                    src={imgEdit}
                                    text="Изменить"
                                    className="green"
                                    title="Изменить данные о стране"
                                    onClick={() => Navigate("/country/edit")}
                                />
                            </div>
                        }

                        <hr />
                        <div className="country-page__row flex-row">
                            <p className="text-gray">Автор страны</p>
                            <ButtonProfile
                                className="tp"
                                src={userData.photo}
                                text={userData.name}
                                subText={userData.tag}
                                onClick={() => Navigate(`/user/${userData.id}`)}
                            />
                        </div>

                        {/* Если есть описание - отображаем */}
                        {userData.country_bio &&
                            <>
                                <hr />
                                <div className="country-page__column">
                                    <p className="text-gray">Описание</p>
                                    <p className="textarea-block">{userData.country_bio}</p>
                                </div>
                            </>
                        }
                    </section>

                    
                    
                    {/* Кнопка появляется если просматривает владелец */}
                    {isSelfRender &&
                        <section>
                            <ButtonImage
                                src={imgAdd}
                                text="Новый пост"
                                title="Создать новый пост"
                                width100
                                onClick={() => Navigate("/news/add")}
                            />
                        </section>
                    }

                    <PostsRender
                        posts={renderPosts}
                    />

                    {showPreload &&
                        <section>
                            <p>Загрузка постов</p>
                        </section>
                    }
                  </>

                // Если страна не найдена, будет показан только когда будет ошибка
                : <>
                    {countryNotFound
                        ? <section className="country-page flex-col">
                            <h2>Страна не найдена!</h2>
                            <ButtonImage
                                src={imgCountry}
                                text="К списку стран"
                                title="Перейти к списку стран"
                                width100
                                onClick={() => Navigate("/country")}
                            />
                          </section>

                        // Предпоказ страницы
                        : <section className="flex-col">
                            <div className="country-page__top">
                                <div className="country-page__top-photo">
                                    <Fullscreen>
                                        <img src={imgBasePhoto} alt="country-profile" draggable="false" />
                                    </Fullscreen>
                                </div>
                                <div className="country-page__top-name">
                                    <h2 className="text-preview">LoremLoremCountry</h2>
                                    <p className="text-preview">@LoremCountry</p>
                                </div>
                            </div>

                            <hr />
                            <div className="country-page__row flex-row">
                                <p className="text-gray">Автор страны</p>
                                <ButtonProfile className="tp" text="LoremLoremUser" preview />
                            </div>

                            <hr />
                            <div className="country-page__column">
                                <p className="text-gray">Описание</p>
                                <p className="textarea-block">
                                    <span className="text-preview">Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
                                    <br />
                                    <span className="text-preview">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, non.</span>
                                    <br />
                                    <span className="text-preview">Lorem ipsum dolor sit amet.</span>
                                </p>
                            </div>
                          </section>
                    }
                </>
            }
        </article>
    )
}
