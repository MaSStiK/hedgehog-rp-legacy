import { useEffect, useContext, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { DataContext } from "../Context"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import Aside from "../Aside/Aside"
import { CONSTS } from "../Global"
import PostsRender from "../PostsRender/PostsRender"
import imgBasePhoto from "../../assets/replace/base-photo-empty.png"

import "./PageCountry.css"
import "./PageCountry-phone.css"

export default function PageCountry() {
    const Context = useContext(DataContext)
    const URLparams = useParams()
    const isSelfRender = Context.userData ? Context.userData.country_id === URLparams.id : false

    const [countryNotFound, setcountryNotFound] = useState(false);
    const [showCopyMessage, setshowCopyMessage] = useState(false);
    
    const [countryData, setcountryData] = useState({});


    useEffect(() => {
        document.title = "Страна" + CONSTS.pageName
    }, [])

    const handleCopyButton = () => {
        navigator.clipboard.writeText(countryData.tag)
        setshowCopyMessage(true)
        setTimeout(() => setshowCopyMessage(false), 2000)
    }

    // Когда загрузились все юзеры
    useEffect(() => {
        if (!Object.keys(Context.users).length) {
            return
        }
        
        let findedUser = Context.users.find(user => user.id === URLparams.id.slice(1))

        if (!findedUser) {
            setcountryNotFound(true)
            setcountryData({})
            return
        }

        setcountryData(findedUser)
        document.title = findedUser.country_title + CONSTS.pageName
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [URLparams.id, Context.users])



    return (
        <>
            <Aside />
            
                <article>
                    <h4 className="page-title text-dark">/ Страна</h4>

                    {/* Если страна найдена */}
                    {Object.keys(countryData).length
                        ? <>
                            <section className="flex-col">
                                <div className="country-page__top">
                                    <div className="country-page__top-photo">
                                        <img src={countryData.country_photo ? countryData.country_photo : imgBasePhoto} alt="userpic" />
                                    </div>
                                    <div className="country-page__top-name">
                                        <h2>{countryData.country_title}</h2>
                                        <p onClick={handleCopyButton} className="country-page__top-tag text-cut text-gray">{showCopyMessage ? "Скопировано" : countryData.country_tag}</p>
                                    </div>
                                </div>

                                {/* Кнопка редактирования страны если страна пользователя */}
                                {isSelfRender &&
                                    <Link to={"/countries/edit"}>
                                        <button className="green">Изменить страну</button>
                                    </Link>
                                }

                                <div className="divider"></div>
                                <div className="country-page__row">
                                    <p className="text-gray">Автор страны</p>
                                    <Link to={`/users/${countryData.id}`}>
                                        <ButtonProfile
                                            className="tp"
                                            src={countryData.photo}
                                            text={countryData.name}
                                        />
                                    </Link>
                                </div>

                                {/* Если есть описание - отображаем */}
                                {countryData.country_bio_main &&
                                    <>
                                        <div className="divider"></div>
                                        <div className="country-page__column">
                                            <p className="text-gray">Описание</p>
                                            <p className="country-page__bio">{countryData.country_bio_main}</p>
                                        </div>
                                    </>
                                }

                                {/* Если есть допю описание - отображаем */}
                                {countryData.country_bio_more &&
                                    <>
                                        <div className="divider"></div>
                                        <div className="flex-col">
                                            <p className="text-gray">Доп. описание</p>
                                            <p className="country-page__bio">{countryData.country_bio_more}</p>
                                        </div>
                                    </>
                                }

                            </section>
                            
                            {/* Кнопка написать новость если страна авторизованного */}
                            {isSelfRender &&
                                <section>
                                    <Link to={"/news/add"}>
                                        <button>Написать новость</button>
                                    </Link>
                                </section>
                            }

                            <PostsRender
                                posts={[...Context.posts].filter(post => post.country_id === URLparams.id)}
                                users={Context.users}
                            />
                        </>

                        // Если страна не найдена, будет показан только когда будет ошибка
                        : <>
                            {countryNotFound && 
                                <section className="country-page">
                                    <h2>Страна не найдена!</h2>
                                    <Link to={"/countries"}>
                                        <button>К списку стран</button>
                                    </Link>
                                </section>
                            }
                        </>
                    }
                </article>
        </>
    )
}
