import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import imgBasePhoto from "../../assets/replace/photo-empty.png"
import { VKAPI } from "../API"
import { setPageTitle } from "../Global"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import imgEdit from "../../assets/icons/Edit.svg"
import imgLogout from "../../assets/icons/Logout.svg"
import imgCopy from "../../assets/icons/Copy.svg"
import imgUser from "../../assets/icons/User.svg"

import "./UserPage.css"
import "./UserPage-phone.css"


export default function UserPage() {
    useEffect(() => {setPageTitle("Участник")}, [])
    const Navigate = useNavigate()
    const Context = useContext(DataContext)
    const URLparams = useParams()
    const isSelfRender = Context.userData ? Context.userData.id === URLparams.id : false

    const [userNotFound, setUserNotFound] = useState(false);
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    
    const [userData, setUserData] = useState({});
    const [userDataVk, setUserDataVk] = useState({});
    const [pageTitleText, setPageTitleText] = useState("");

    function CopyTag() {
        navigator.clipboard.writeText(userData.tag)
        setShowCopyMessage(true)
        setTimeout(() => setShowCopyMessage(false), 2000)
    }

    function logoutProfile() {
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

        let foundUser = Context.users.find(user => user.id === URLparams.id)

        if (!foundUser) {
            setUserNotFound(true)
            setUserData({})
            setUserDataVk({})
            setPageTitle("Участник не найден")
            setPageTitleText(URLparams.id)
            return
        }

        setUserData(foundUser)
        setPageTitle(foundUser.name)
        setPageTitleText(foundUser.id)
    }, [URLparams.id, Context.users])

    useEffect(() => {
        setUserDataVk({})

        // Если юзер в кэше
        if (sessionStorage["vkUser" + URLparams.id]) {
            let hashVkUser = JSON.parse(sessionStorage["vkUser" + URLparams.id])
            setUserDataVk({
                photo: hashVkUser.photo,
                name: hashVkUser.name
            })
            return
        }

        // Находим информацию о пользователе в вк при изменении id поиска
        VKAPI("users.get", {user_id: URLparams.id, fields: "photo_100"}, (vkData) => {
            console.log("VKAPI: users.get");
            if (vkData.response.length) {
                vkData = vkData.response[0]

                // Сохраняем юзера
                sessionStorage["vkUser" + vkData.id] = JSON.stringify({
                    photo: vkData.photo_100,
                    name: `${vkData.first_name} ${vkData.last_name}`
                })

                setUserDataVk({
                    photo: vkData.photo_100,
                    name: `${vkData.first_name} ${vkData.last_name}`
                })
            }
        })
    }, [URLparams.id])

    return (
        <article>
            <h4 className="page-title">{`h/user/${pageTitleText}`}</h4>

            {/* Если юзер найден */}
            {Object.keys(userData).length
                ? <section className="flex-col">
                    <div className="user-profile__top">
                        <div className="user-profile__top-photo">
                            <ImageFullscreen>
                                <img src={userData.photo ? userData.photo : imgBasePhoto} alt="user-profile" draggable="false" />
                            </ImageFullscreen>
                        </div>
                        <div className="user-profile__top-name">
                            <h2>{userData.name}</h2>
                            <div className="user-profile__top-tag flex-row" onClick={CopyTag}>
                                <img className="image-gray" src={imgCopy} alt="copy-tag" draggable="false" />
                                <p className="text-cut text-gray">{showCopyMessage ? "Скопировано" : userData.tag}</p>
                            </div>
                        </div>
                    </div>

                    {/* Кнопка изменения профиля и выхода из аккаунта если отображается профиль владельца страницы */}
                    {isSelfRender &&
                        <div className="user-profile__buttons flex-row">
                            <ButtonImage
                                src={imgEdit}
                                text="Изменить профиль"
                                className="green"
                                onClick={() => Navigate("/user/edit")}
                            />

                            {/* Кнопка выхода если отображается профиль владельца страницы */}
                            <ButtonImage
                                src={imgLogout}
                                text="Выйти из профиля"
                                className="red"
                                onClick={logoutProfile}
                            />
                        </div>
                    }

                    <hr />
                    <div className="user-profile__row flex-row">
                        <p className="text-gray">ВКонтакте</p>
                        <ButtonProfile
                            className="tp"
                            src={userDataVk.photo || imgBasePhoto}
                            text={userDataVk.name || "Загрузка"}
                            onClick={() => window.open(`https://vk.com/id${userData.id}`, "_blank")}
                        />
                    </div>
                    
                    {/* Если есть страна - отображаем */}
                    {userData.country_id &&
                        <>
                            <hr />
                            <div className="user-profile__row flex-row">
                                <p className="text-gray">Страна</p>
                                {userData.country_id !== "c769201685" // Если страна админа - ссылка на обновления
                                    ? <ButtonProfile
                                        className="tp"
                                        src={userData.country_photo}
                                        text={userData.country_name}
                                        subText={userData.country_tag}
                                        onClick={() => Navigate(`/country/${userData.country_id}`)}
                                      />
                                    : <ButtonProfile
                                        className="tp"
                                        src={userData.country_photo}
                                        text={userData.country_name}
                                        onClick={() => Navigate(`/changelogs`)}
                                      />
                                }
                            </div>
                        </>
                    }

                    {/* Если есть роли - отображаем */}
                    {/* {userData.roles.length !== 0 &&
                        <>
                            <hr />
                            <div className="user-profile__row flex-row">
                                <p className="text-gray">Роли</p>
                                <p className="text-white">{userData.roles.join(" | ")}</p>
                            </div>
                        </>
                    } */}
                    

                    {/* Если есть описание - отображаем */}
                    {userData.bio &&
                        <>
                            <hr />
                            <div className="flex-col">
                                <p className="text-gray">О себе</p>
                                <p className="textarea-block">{userData.bio}</p>
                            </div>
                        </>
                    }
                </section>
                
                // Если пользователь не найден, будет показан только когда будет ошибка
                : <> 
                    {userNotFound &&
                        <section className="flex-col">
                            <h2>Участник не найден!</h2>
                            <ButtonImage
                                src={imgUser}
                                text="К списку участников"
                                width100
                                onClick={() => Navigate("/user")}
                            />
                        </section>
                    }
                </>
            }
        </article>
    )
}
