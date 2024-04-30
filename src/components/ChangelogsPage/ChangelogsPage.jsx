import { useState, useEffect, useRef, useContext } from "react"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import { DataContext } from "../Context"
import { setPageTitle } from "../Global"
import changelogs from "./changelogs"


import "./ChangelogsPage.css"

export default function ChangelogsPage() {
    useEffect(() => {setPageTitle("Изменения")}, [])
    const Context = useContext(DataContext)

    // Ищем профиль со страной изменений
    const [changelogProfile, setChangelogProfile] = useState(Context.users.find(user => user.country_id === "c769201685"))
    useEffect(() => {
        setChangelogProfile(Context.users.find(user => user.country_id === "c769201685"))
    }, [Context.users])

    return (
        <article>
            <h4 className="page-title">h/changelogs</h4>

            {/* Когда загрузятся профили - рендерим обновления */}
            {changelogProfile &&
                <>
                    {changelogs.map((changelog, index) => (
                        <section className="post flex-col" key={index}>
                            <div className="post__top flex-row">
                                <ButtonProfile
                                    src={changelogProfile.country_photo}
                                    text={changelogProfile.country_title}
                                />
                                <small className="text-gray">{changelog.date}</small>
                            </div>
                            <h3>{changelog.title}</h3>
                            <p>{changelog.text}</p>
                            {changelog.attach.length
                                ? <>
                                    {changelog.attach.length !== 1
                                        ? <div className="post__attachments-container">
                                            <div className="post__attachments">
                                            {changelog.attach.map((attach, index) => {
                                                return <ImageFullscreen key={index}>
                                                    <img src={attach} alt="post-attachment" />
                                                </ImageFullscreen>
                                            })}
                                            </div>
                                        </div> 
                                        : <ImageFullscreen>
                                            <img src={changelog.attach[0]} alt="post-attachment" className="post__attachment__single-img" />
                                        </ImageFullscreen>
                                    }
                                    </>
                                : null
                            }
                        </section>
                    ))}
                </>
            }
        </article>
    )
}