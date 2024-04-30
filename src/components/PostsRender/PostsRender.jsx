import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ButtonImage from "../ButtonImage/ButtonImage"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import PostShare from "./PostShare";
import imgShare from "../../assets/icons/Share.svg"


import "./Post.css"
import "./Post-phone.css"

function PostRender({
    post,
    postAuthor,
    ...props
}) {
    const Context = useContext(DataContext)
    const NavigateTo = useNavigate()

    // Дата создания поста
    let date = new Date(Number(post.timestamp))

    let hours = date.getHours().toString()
    hours = hours.length !== 2 ? "0" + hours : hours // Формат часов 00

    let minutes = date.getMinutes().toString()
    minutes = minutes.length !== 2 ? "0" + minutes : minutes // Формат минут 00

    let day = date.getDate().toString()
    day = day.length !== 2 ? "0" + day : day // Формат дня 00

    let month = (date.getMonth() + 1).toString() // Добавляем 1 т.к. месяц начинается с нуля
    month = month.length !== 2 ? "0" + month : month // Формат месяца 00

    let year = date.getFullYear()

    let postAttachments = JSON.parse(post.attachments) // Картинки в посте

    return (
        <section className="post flex-col" id={`post-${post.post_id}`} key={post.post_id}>
            <div className="post__top flex-row">
                <ButtonProfile
                    src={postAuthor.country_photo}
                    text={postAuthor.country_title}
                    subText={postAuthor.country_tag} 
                    onClick={() => NavigateTo("/country/" + postAuthor.country_id)}
                />
                <small className="text-gray">{`${day}.${month}.${year}`}<br/>{`${hours}:${minutes}`}</small>
            </div>
            {/* Заголовок поста */}
            <h3>{post.post_title}</h3>
            {/* Текст поста не обязателен */}
            {post.post_text &&
                <p>{post.post_text}</p>
            }

            {postAttachments.length
                ? <>
                    {postAttachments.length !== 1
                        ? <div className="post__attachments-container">
                            <div className="post__attachments">
                                {postAttachments.map((attach, index) => {
                                    return <ImageFullscreen key={index}>
                                        <img src={attach} alt="post-attachment" />
                                    </ImageFullscreen>
                                })}
                            </div>
                          </div> 
                        : <ImageFullscreen>
                            <img src={postAttachments[0]} alt="post-attachment" className="post__attachment__single-img" />
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
                    onClick={() => {
                        PostShare(
                            Context,
                            post.post_id,
                            post.post_title,
                            postAttachments.length ? postAttachments[0] : postAuthor.country_photo
                        )
                    }}
                />
            </div>
        </section>
    )
}

export default function PostsRender({
    posts = [],
    users = [],
    ...props
}) {
    return (
        <>
            {posts.map((post) => {
                let postAuthor = users.find(user => user.country_id === post.country_id)

                // Если автора нету - не возвращаем
                if (postAuthor) {
                    return (
                        <PostRender
                            key={post.post_id}
                            post={post}
                            postAuthor={postAuthor}
                        />
                    )
                }

                return null
            })}
        </>
    )
}