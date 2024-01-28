import { useState } from "react";
import { Link } from "react-router-dom"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ButtonIcon from "../ButtonIcon/ButtonIcon"
import imgShare from "../../assets/icons/Share.svg"
import imgEdit from "../../assets/icons/Edit.svg"


import "./Post.css"
import "./Post-phone.css"

function PostRender(props) {
    const [showText, setshowText] = useState(false)

    function handleShare(postId) {
        navigator.clipboard.writeText(window.location.href.split("/#/")[0] + "/#/news/" + postId)

        setshowText(true)
        setTimeout(() => setshowText(false), 2000)
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
                <small className="text-gray">{`${day}.${month}.${year}`}<br />{`${hours}:${minutes}`}</small>
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
                <ButtonIcon 
                    src={imgShare}
                    alt="close-menu"
                    onClick={() => handleShare(props.post.post_id)}
                />
            </div>

            {showText &&
                <p className="text-gray">Ссылка скопирована</p>
            }
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