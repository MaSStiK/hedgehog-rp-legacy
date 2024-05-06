import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ButtonImage from "../ButtonImage/ButtonImage"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import PostShare from "./PostShare";
import imgShare from "../../assets/icons/Share.svg"

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

    // Дата создания поста
    let date = new Date(Number(post.timestamp))
    let hours = date.getHours().toString()
    let minutes = date.getMinutes().toString()
    let day = date.getDate().toString()
    let month = (date.getMonth() + 1).toString() // Добавляем 1 т.к. месяц начинается с нуля
    let year = date.getFullYear()
    hours = hours.length !== 2 ? "0" + hours : hours // Формат часов 00
    minutes = minutes.length !== 2 ? "0" + minutes : minutes // Формат минут 00
    day = day.length !== 2 ? "0" + day : day // Формат дня 00
    month = month.length !== 2 ? "0" + month : month // Формат месяца 00

    let postAttachments = JSON.parse(post.attachments) // Картинки в посте

    function generatePost() {
        return (
            <>
                <div className="post__top flex-row">
                    <ButtonProfile
                        src={postAuthor.country_photo}
                        text={postAuthor.country_title}
                        subText={postAuthor.country_tag} 
                        onClick={() => Navigate("/country/" + postAuthor.country_id)}
                    />
                    <small className="text-gray">{`${day}.${month}.${year}`}<br/>{`${hours}:${minutes}`}</small>
                </div>
                {/* Заголовок поста */}
                <h3>{post.post_title}</h3>
    
                {/* Текст поста не обязателен */}
                {post.post_text && <p>{post.post_text}</p> }
    
                {/* Если картинок нету - не рендерим блок с ними */}
                {postAttachments.length
                    ? <>
                        {/* Если картинок много - блок с ограниченной высотой, иначе одна картинка которую растягивает на всю ширину */}
                        {postAttachments.length !== 1
                            ? <div className="post__attachments-container">
                                <div className="post__attachments">
                                    {postAttachments.map((attach, index) => {
                                        return <ImageFullscreen key={index}>
                                            <img src={attach} alt="post-attachment" draggable="false" />
                                        </ImageFullscreen>
                                    })}
                                </div>
                              </div> 
                            : <ImageFullscreen>
                                <img src={postAttachments[0]} alt="post-attachment" className="post__attachment__single-img" draggable="false" />
                              </ImageFullscreen>
                        }
                        </>
                    : null
                }
    
                <div className=" flex-row post__buttons">
                    <ButtonImage
                        className="tp"
                        src={imgShare}
                        alt="post-share"
                        text="Поделиться"
                        onClick={handlePostShare}
                    />
                </div>
            </>
        )
    }

    if (!noSection) { // Рендер внутри section
        return (
            <section
                key={post.post_id}
                id={`post-${post.post_id}`}
                className="post flex-col"
            >
                {generatePost()}
            </section>
        )
    } else { // Если передаем noSection - рендер в обычном div (без bg и border)
        return (
            <div key={post.post_id} id={`post-${post.post_id}`} className="post flex-col">
                {generatePost()}
            </div>
        )
    }

}