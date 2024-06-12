import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ButtonImage from "../ButtonImage/ButtonImage"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import { timestampToDate } from "../Global";
import PostShare from "./PostShare"
import imgShare from "../../assets/svg/Share.svg"
import imgEdit from "../../assets/svg/Edit.svg"
import imgArrowLeft from "../../assets/svg/Arrow-left.svg"
import imgArrowRight from "../../assets/svg/Arrow-right.svg"


export default function PostRender({
    post,
    postAuthor,
    noSection
}) {
    const Context = useContext(DataContext) // Контекст нужен только что бы его передать в модальное окно
    const Navigate = useNavigate()

    // Функция открывающая модальное окно с возможными вариантами как поделиться постом
    function handlePostShare() {
        PostShare(
            Context, // Передаем контекст что бы можно было закрыть модальное окно
            post.post_id,
            post.post_title,
            postAttachments.length ? postAttachments[0] : postAuthor.country_photo
        )
    }

    // Функция открытия страницы с редактированием поста
    function handlePostEdit() {
        Navigate("/news/edit", {state: post})
    }

    let postAttachments = JSON.parse(post.attachments) // Картинки в посте
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
        setAttachCounter(attachCounter === 1 ? postAttachments.length : attachCounter - 1)
    }

    function sliderNext() { // Следующий элемент
        // Если последний элемент - ставим первый
        setAttachCounter(attachCounter === postAttachments.length ? 1 : attachCounter + 1)
    }

    // Дата создания поста
    let date = timestampToDate(Number(post.timestamp))

    function generatePost() {
        return (
            <>
                <div className="flex-row post__top">
                    <ButtonProfile
                        src={postAuthor.country_photo}
                        text={postAuthor.country_name}
                        subText={postAuthor.country_tag} 
                        onClick={() => Navigate("/country/" + postAuthor.country_id)}
                    />
                    <small className="text-gray">{date.stringDate}<br />{date.stringTime}</small>
                </div>
                {/* Заголовок поста */}
                <h3>{post.post_title}</h3>
    
                {/* Текст поста не обязателен */}
                {post.post_text && <p>{post.post_text}</p> }
    
                {/* Если картинок нету - не рендерим блок с ними */}
                {postAttachments.length !== 0 &&
                    <>
                        {/* Если картинок много - блок с ограниченной высотой, иначе одна картинка которую растягивает на всю ширину */}
                        {postAttachments.length !== 1
                            ? <>
                                <div className="post__attachments-wrapper" ref={attachContainer}>
                                    <div className="post__attachments-container" style={{left: `${-attachWidth * (attachCounter - 1)}px`}}>
                                        {postAttachments.map((attach, index) => (
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
                                    <p><span>{attachCounter}</span> из <span>{postAttachments.length}</span></p>
                                    <ButtonImage
                                        src={imgArrowRight}
                                        alt="image-next"
                                        onClick={sliderNext}
                                    />
                                </div>
                              </> 
                            : <ImageFullscreen>
                                <img src={postAttachments[0]} alt="post-attachment" className="post__attachment_single" draggable="false" />
                            </ImageFullscreen>
                        }
                    </>
                }

                {/* Кнопки под постом */}
                <div className="flex-row post__buttons">
                    <ButtonImage
                        src={imgShare}
                        alt="post-share"
                        text="Поделиться"
                        onClick={handlePostShare}
                    />

                    {/* Если пост авторизованного пользователя */}
                    {Context.userData?.id === postAuthor.id &&
                        <ButtonImage
                            src={imgEdit}
                            alt="post-edit"
                            text="Изменить"
                            onClick={handlePostEdit}
                        />
                    }
                </div>
            </>
        )
    }

    if (!noSection) { // Рендер внутри section
        return (
            <section
                key={post.post_id}
                id={`post-${post.post_id}`}
                className="flex-col post"
            >
                {generatePost()}
            </section>
        )
    } else { // Если передаем noSection - рендер в обычном div (без bg и border)
        return (
            <div
                key={post.post_id}
                id={`post-${post.post_id}`} 
                className="flex-col post"
            >
                {generatePost()}
            </div>
        )
    }
}