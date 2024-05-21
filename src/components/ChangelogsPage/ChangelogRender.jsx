import { useState, useEffect, useRef, useContext } from "react"
import { useNavigate } from "react-router-dom";
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ButtonImage from "../ButtonImage/ButtonImage"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import { DataContext } from "../Context"

import imgArrowLeft from "../../assets/icons/Arrow-left.svg"
import imgArrowRight from "../../assets/icons/Arrow-right.svg"


export default function ChangelogRender({
    changelog,
    noSection
}) {
    const Context = useContext(DataContext)
    const Navigate = useNavigate()

    // Ищем профиль со страной изменений
    let changelogProfile = Context.users.find(user => user.country_id === "c769201685")

    const [attachCounter, setAttachCounter] = useState(1) // Счетчик картинок в посте
    const [attachWidth, setAttachWidth] = useState(0) // Ширина картинки (Во всю ширину поста)
    const attachContainer = useRef()

    function resizeAttach() { // Установка ширины картинки
        setAttachWidth(attachContainer.current ? attachContainer.current.offsetWidth : 0)
    }
    window.addEventListener("resize", (resizeAttach)) // Обновляем ширину картинки при изменении ширины браузера
    useEffect(resizeAttach, [attachContainer]) // Устанавливаем ширину картинки как только контейнер с картинками доступен
    
    function sliderPrev() { // Предыдущий элемент
        // Если первый элемент - ставим последний
        setAttachCounter(attachCounter === 1 ? changelog.attach.length : attachCounter - 1)
    }

    function sliderNext() { // Следующий элемент
        // Если последний элемент - ставим первый
        setAttachCounter(attachCounter === changelog.attach.length ? 1 : attachCounter + 1)
    }

    function generatePost() {
        return (
            <>
                <div className="post__top flex-row">
                    <ButtonProfile
                        src={changelogProfile.country_photo}
                        text={changelogProfile.country_name}
                        onClick={() => Navigate("/changelogs")}
                    />
                    <small className="text-gray">{changelog.date}</small>
                </div>
                <h3>{changelog.title}</h3>
                <p>{changelog.text}</p>
                
                {changelog.attach.length !== 0 &&
                    <>
                        {changelog.attach.length !== 1
                            ? <>
                                <div className="post__attachments-wrapper" ref={attachContainer}>
                                    <div className="post__attachments-container" style={{left: `${-attachWidth * (attachCounter - 1)}px`}}>
                                        {changelog.attach.map((attach, index) => (
                                            <div className="post__attachment" key={index}>
                                                <ImageFullscreen>
                                                    <img src={attach} alt="post-attachment" draggable="false" style={{width: attachWidth}} />
                                                </ImageFullscreen>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-row post__attachments-control">
                                    <ButtonImage
                                        src={imgArrowLeft}
                                        alt="image-prev"
                                        onClick={sliderPrev}
                                    />
                                    <p><span>{attachCounter}</span> из <span>{changelog.attach.length}</span></p>
                                    <ButtonImage
                                        src={imgArrowRight}
                                        alt="image-next"
                                        onClick={sliderNext}
                                    />
                                </div>
                              </>
                            : <ImageFullscreen>
                                <img src={changelog.attach[0]} alt="post-attachment" className="post__attachment_single" draggable="false" />
                            </ImageFullscreen>
                        }
                    </>
                }
            </>
        )
    }

    if (!noSection) { // Рендер внутри section
        return (
            <section className="post flex-col">
                {generatePost()}
            </section>
        )
    } else { // Если передаем noSection - рендер в обычном div (без bg и border)
        return (
            <div className="post flex-col">
                {generatePost()}
            </div>
        )
    }
}