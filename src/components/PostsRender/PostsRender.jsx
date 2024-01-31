import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgShare from "../../assets/icons/Share.svg"
import imgCopy from "../../assets/icons/Copy.svg"
import imgVk from "../../assets/tools/vk.png"


import "./Post.css"
import "./Post-phone.css"

function PostRender(props) {
    const NavigateTo = useNavigate()

    const Context = useContext(DataContext)
    

    function handleShare(postId, postTitle, postImg) {
        Context.setModalData(
            <>
                <h3 className="modal__title">Поделиться ссылкой</h3>
                
                <div className="flex-row" style={{flexWrap: "wrap"}}>
                    <ButtonImage
                        src={imgVk}
                        text={"Отправить в вк"}
                        onClick={() =>  {
                            // Отпраялем и закрываем модальное окно
                            let url = "https://vk.com/share.php?"
                            url += "url=" + encodeURIComponent("https://masstik.github.io/hedgehog.rp/#/news/" + postId)
                            url += "&title=" + encodeURIComponent(postTitle)
                            url += "&image=" + encodeURIComponent(postImg)
                            url += "&noparse=true"

                            window.open(url, "", "toolbar=0,status=0,popup=1,width=500,height=500")
                            Context.setModalData({})
                        }}
                    />

                    <ButtonImage
                        src={imgCopy}
                        text={"Скопировать ссылку"}
                        onClick={() => {
                            // Копируем ссылку и закрываем модальное окно
                            navigator.clipboard.writeText("https://masstik.github.io/hedgehog.rp/#/news/" + postId)
                            Context.setModalData({})
                        }}
                    />
                </div>
            </>
        )
    }


    // Дата появления в беседе
    let date = new Date(Number(props.post.timestamp))

    let hours = date.getHours().toString()
    hours = hours.length !== 2 ? "0" + hours : hours // Формат часов 00

    let minutes = date.getMinutes().toString()
    minutes = minutes.length !== 2 ? "0" + minutes : minutes // Формат минут 00

    let day = date.getDate().toString()
    day = day.length !== 2 ? "0" + day : day // Формат дня 00

    let month = (date.getMonth() + 1).toString() // Добавляем 1 т.к. месяц начинается с нуля
    month = month.length !== 2 ? "0" + month : month // Формат месяца 00

    let year = date.getFullYear()

    let postAttachments = JSON.parse(props.post.attachments) // Картинки в посте

    return (
        <section className="post">
            <div className="post__top">
                <Link to={"/countries/" + props.postAuthor.country_id}>
                    <ButtonProfile
                        src={props.postAuthor.country_photo}
                        text={props.postAuthor.country_title}
                        subText={props.postAuthor.country_tag} 
                    />
                </Link>
                <small className="text-gray">{`${day}.${month}.${year}`}<br/>{`${hours}:${minutes}`}</small>
            </div>
            
            <h3>{props.post.post_title}</h3>

            {props.post.post_text &&
                <p>{props.post.post_text}</p>
            }

            {postAttachments.length
                ? <>
                    {postAttachments.length !== 1
                        ? <div className="post__attachments-wrapper">
                            <div className="post__attachments">
                                {postAttachments.map((attach, index) => {
                                    return <img src={attach} alt="post-attachment" key={index} />
                                })}
                            </div>
                          </div> 
                        : <img src={postAttachments[0]} alt="post-attachment" className="post__attachment__single-img" />
                    }
                    </>
                : null
            }

            <div className=" flex-row post__buttons">
                <ButtonImage 
                    src={imgShare}
                    alt="close-menu"
                    onClick={() => {
                        handleShare(
                            props.post.post_id,
                            props.post.post_title,
                            postAttachments.length ? postAttachments[0] : props.postAuthor.country_photo
                        )
                    }}
                />
            </div>
        </section>
    )
}

export default function PostsRender(props) {
    return (
        <>
            {props.posts.map((post) => {
                let postAuthor = props.users.find(user => user.country_id === post.country_id)

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


PostsRender.defaultProps = {
    posts: [],
    users: []
}