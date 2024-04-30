import { useEffect, useContext, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { setPageTitle } from "../Global"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import PostsRender from "../PostsRender/PostsRender"
import imgBasePhoto from "../../assets/replace/base-photo-empty.png"
import imgEdit from "../../assets/icons/Edit.svg"
import imgCopy from "../../assets/icons/Copy.svg"
import imgCountry from "../../assets/icons/Country.svg"


import "./CountryPage.css"
import "./CountryPage-phone.css"

export default function CountryPage() {
    useEffect(() => {setPageTitle("Страна")}, [])
    const Context = useContext(DataContext)
    const NavigateTo = useNavigate()
    const URLparams = useParams()
    const isSelfRender = Context.userData ? Context.userData.country_id === URLparams.id : false

    const [countryNotFound, setCountryNotFound] = useState(false);
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    
    const [userData, setUserData] = useState({});
    const [pageTitleText, setPageTitleText] = useState("");


    function CopyTag() {
        navigator.clipboard.writeText(userData.tag)
        setShowCopyMessage(true)
        setTimeout(() => setShowCopyMessage(false), 2000)
    }

    // Когда загрузились все юзеры
    useEffect(() => {
        if (!Object.keys(Context.users).length) {
            return
        }
        
        let foundUser = Context.users.find(user => user.id === URLparams.id.slice(1))

        if (!foundUser) {
            setCountryNotFound(true)
            setUserData({})
            setPageTitle("Страна не найдена")
            setPageTitleText(URLparams.id)
            return
        }

        setUserData(foundUser)
        setPageTitle(foundUser.country_title)
        setPageTitleText(foundUser.country_id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [URLparams.id, Context.users])



    return (
        <article>
            <h4 className="page-title">{`h/country/${pageTitleText}`}</h4>

            {/* Если страна найдена */}
            {Object.keys(userData).length
                ? <>
                    <section className="flex-col">
                        <div className="country-page__top">
                            <div className="country-page__top-photo">
                                <ImageFullscreen>
                                    <img src={userData.country_photo ? userData.country_photo : imgBasePhoto} alt="country-profile" />
                                </ImageFullscreen>
                            </div>
                            <div className="country-page__top-name">
                                <h2>{userData.country_title}</h2>
                                <div className="country-page__top-tag flex-row" onClick={CopyTag}>
                                    <img className="image-gray" src={imgCopy} alt="copy-tag" />
                                    <p className="text-cut text-gray">{showCopyMessage ? "Скопировано" : userData.country_tag}</p>
                                </div>
                            </div>
                        </div>

                        {/* Кнопка редактирования страны если отображается страна владельца */}
                        {isSelfRender &&
                            <div className="country-page__buttons flex-row">
                                <ButtonImage
                                    src={imgEdit}
                                    text="Изменить страну"
                                    className="green"
                                    width100
                                    onClick={() => NavigateTo("/country/edit")}
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
                                onClick={() => NavigateTo(`/user/${userData.id}`)}
                            />
                        </div>

                        {/* Если есть описание - отображаем */}
                        {userData.country_bio_main &&
                            <>
                                <hr />
                                <div className="country-page__column">
                                    <p className="text-gray">Описание</p>
                                    <p className="textarea-block">{userData.country_bio_main}</p>
                                </div>
                            </>
                        }

                        {/* Если есть доп описание - отображаем */}
                        {userData.country_bio_more &&
                            <>
                                <hr />
                                <div className="flex-col">
                                    <p className="text-gray">Доп. описание</p>
                                    <p className="textarea-block">{userData.country_bio_more}</p>
                                </div>
                            </>
                        }

                    </section>
                    
                    {/* Кнопка появляется если просматривает владелец */}
                    {isSelfRender &&
                        <section>
                            <ButtonImage
                                src={imgEdit}
                                text="Написать новость"
                                width100
                                onClick={() => NavigateTo("/news/add")}
                            />
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
                        <section className="country-page flex-col">
                            <h2>Страна не найдена!</h2>
                            <ButtonImage
                                src={imgCountry}
                                text="К списку стран"
                                width100
                                onClick={() => NavigateTo("/country")}
                            />
                        </section>
                    }
                </>
            }
        </article>
    )
}
