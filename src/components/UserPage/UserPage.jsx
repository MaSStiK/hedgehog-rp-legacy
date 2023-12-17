import { useState, useEffect, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomButton from "../CustomButton/CustomButton"
import Aside from "../Aside/Aside"
import imgBasePhoto from "../../assets/replace/base-photo-empty.png"
import { VKAPI } from "../VK-API"

import "./UserPage.css"
import "./UserPage-phone.css"


export default function UserPage() {
    const Navigate = useNavigate()
    const Context = useContext(DataContext)
    const URLparams = useParams()
    const isSelfRender = Context.userData ? Context.userData.id === URLparams.id : false

    const [userNotFound, setuserNotFound] = useState(false);
    const [showCopyMessage, setshowCopyMessage] = useState(false);
    
    const [userData, setuserData] = useState({});
    const [userDataVk, setuserDataVk] = useState({});

    useEffect(() => {
        document.title = "Участник | Ежиное-РП"
    }, [])

    const handleCopyButton = () => {
        navigator.clipboard.writeText(userData.tag)
        setshowCopyMessage(true)
        setTimeout(() => setshowCopyMessage(false), 2000)
    }

    const handleExitProfile = () => {
        delete localStorage.userData
        delete Context.userData
        Navigate("/")
        window.location.reload()
    }

    // Когда загрузились все юзеры
    useEffect(() => {
        if (!Object.keys(Context.users).length) {
            return
        }

        let findedUser = Context.users.find(user => user.id === URLparams.id)

        if (!findedUser) {
            setuserNotFound(true)
            setuserData({})
            setuserDataVk({})
            return
        }

        setuserData(findedUser)
        document.title = findedUser.name + " | Ежиное-РП"
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [URLparams.id, Context.users])

    useEffect(() => {
        setuserDataVk({})

        // Если юзер в кэше
        if (sessionStorage["vkUser" + URLparams.id]) {
            let hashVkUser = JSON.parse(sessionStorage["vkUser" + URLparams.id])
            setuserDataVk({
                photo: hashVkUser.photo,
                name: hashVkUser.name
            })
            return
        }

        // Находим информацию о пользователе в вк при изменении id поиска
        VKAPI("users.get", {user_id: URLparams.id, fields: "photo_200"}, (vkData) => {
            console.log("VKAPI: users.get");
            if (vkData.response.length) {
                vkData = vkData.response[0]

                // Сохраняем юзера
                sessionStorage["vkUser" + vkData.id] = JSON.stringify({
                    photo: vkData.photo_200,
                    name: `${vkData.first_name} ${vkData.last_name}`
                })

                setuserDataVk({
                    photo: vkData.photo_200,
                    name: `${vkData.first_name} ${vkData.last_name}`
                })
            }
        })
    }, [URLparams.id])

    return (
        <>
            <Aside />
            <article id="article-user">
                <h4 className="page-title text-dark">/ Участник</h4>

                {/* Если юзер найден */}
                {Object.keys(userData).length
                    ? <section className="user-profile">
                        <div className="user-profile__top">
                            <div className="user-profile__top-photo">
                                <img src={userData.photo ? userData.photo : imgBasePhoto} alt="userpic" />
                            </div>
                            <div className="user-profile__top-name">
                                <h2>{userData.name}</h2>
                                <p onClick={handleCopyButton} className="user-profile__top-tag text-cut text-gray">{showCopyMessage ? "Скопировано" : userData.tag}</p>
                            </div>
                        </div>

                        {/* Кнопка изменения страницы если отображается профиль владельда страницы */}
                        {isSelfRender &&
                            <Link to={"/users/edit"}>
                                <button className="green">Изменить профиль (Скоро)</button>
                            </Link>
                        }

                        {/* Кнопка выхода если отображается профиль владельда страницы */}
                        {isSelfRender &&
                            <button className="red" onClick={handleExitProfile}>Выйти из профиля</button>
                        }

                        <div className="user-profile__divider"></div>
                        <div className="user-profile__row">
                            <p className="text-gray">ВКонтакте</p>
                            <Link to={`https://vk.com/id${userData.id}`} target="_blank" rel="noopener noreferrer">
                                <CustomButton
                                    src={userDataVk.photo}
                                    text={userDataVk.name}
                                />
                            </Link>
                        </div>
                        
                        {/* Если есть страна - отображаем */}
                        {userData.country_id &&
                            <>
                                <div className="user-profile__divider"></div>
                                <div className="user-profile__row">
                                    <p className="text-gray">Страна</p>
                                    <Link to={`/countries/${userData.country_id}`}>
                                        <CustomButton
                                            src={userData.country_photo}
                                            text={userData.country_title}
                                        />
                                    </Link>
                                </div>
                            </>
                        }
                        

                        {/* Если есть описание - отображаем */}
                        {userData.bio &&
                            <>
                                <div className="user-profile__divider"></div>
                                <div className="user-profile__column">
                                    <p className="text-gray">О себе</p>
                                    <p className="user-profile__bio">{userData.bio}</p>
                                </div>
                            </>
                        }
                    </section>
                    
                    // Если пользователь не найден, будет показан только когда будет ошибка
                    : <section className={`user-profile ${!userNotFound ? "hidden" : null}`}>
                        <h2>Участник не найден!</h2>
                        <Link to={"/users"}>
                            <button>К списку участников</button>
                        </Link>
                    </section>
                }

            </article>
        </>
    )
}
