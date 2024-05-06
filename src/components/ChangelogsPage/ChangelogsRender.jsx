import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import { DataContext } from "../Context"


export default function ChangelogsRender({
    changelogs,
    noSection
}) {
    const Context = useContext(DataContext)
    const Navigate = useNavigate()

    // Ищем профиль со страной изменений
    let changelogProfile = Context.users.find(user => user.country_id === "c769201685")

    function generatePost(changelog) {
        return (
            <>
                <div className="post__top flex-row">
                    <ButtonProfile
                        src={changelogProfile.country_photo}
                        text={changelogProfile.country_title}
                        onClick={() => Navigate("/changelogs")}
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
                                        <img src={attach} alt="post-attachment" draggable="false" />
                                    </ImageFullscreen>
                                })}
                                </div>
                            </div> 
                            : <ImageFullscreen>
                                <img src={changelog.attach[0]} alt="post-attachment" className="post__attachment__single-img" draggable="false" />
                            </ImageFullscreen>
                        }
                        </>
                    : null
                }
            </>
        )
    }

    return (
        <>
            {changelogs.map((changelog, index) => {
                if (!noSection) { // Рендер внутри section
                    return (
                        <section className="post flex-col" key={index}>
                            {generatePost(changelog)}
                        </section>
                    )
                } else { // Если передаем noSection - рендер в обычном div (без bg и border)
                    return (
                        <div className="post flex-col" key={index}>
                            {generatePost(changelog)}
                        </div>
                    )
                }
            })}
        </>
    )
}