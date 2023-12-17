import { Link } from "react-router-dom"
import CustomButton from "../CustomButton/CustomButton"

import "./Post.css"
import "./Post-phone.css"

export default function PostsRender(props) {
    return (
        <>
            {props.posts.map((post) => {
                let postAuthor = props.users.find(user => user.country_id === post.country_id)

                // Дата появления в беседе
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

                // Если автора нету - не возвращаем
                if (postAuthor) {
                    return <section className="post" key={post.post_id}>
                        <div className="post__top">
                            <Link to={"/countries/" + postAuthor.country_id} key={postAuthor.country_id}>
                                <CustomButton
                                    src={postAuthor.country_photo}
                                    text={postAuthor.country_title}
                                    subText={postAuthor.country_tag} 
                                />
                            </Link>
                            <small className="text-gray">{`${day}.${month}.${year}`}<br />{`${hours}:${minutes}`}</small>
                        </div>
                        
                        <h3>{post.post_title}</h3>

                        {post.post_text &&
                            <p>{post.post_text}</p>
                        }

                        {postAttachments.length
                            ? <div className="post__attachments-wrapper">
                                <div className="post__attachments">
                                    {postAttachments.map((attach) => {
                                        return <img src={attach} alt="post-attachment" />
                                    })}
                                </div>
                              </div> 
                            : null
                        }

                    </section>
                }

                return null
            })}
        </>
    )
}


CustomButton.defaultProps = {
    posts: [],
    users: []
}