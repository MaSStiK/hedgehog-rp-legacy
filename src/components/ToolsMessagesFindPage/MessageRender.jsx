import { useNavigate } from "react-router-dom"
import { timestampToDate } from "../Global";

export default function MessageRender({ message, user }) {
    const Navigate = useNavigate()

    // Открываем создание поста
    function postCreate() {
        Navigate("/news/add", {state: message})
    }

    // Дата создания поста (Добавляем три нуля в конце)
    let date = timestampToDate(Number(message.date * 1000))

    return (
        <button className="vk-message tp flex-row" onClick={postCreate}>
            <img className="vk-message__user-image" src={user.photo_100} alt="user" />
            <div className="vk-message__info flex-col">
                <p className="vk-message__info-name">{user.first_name} {user.last_name}<span>{date.stringDate} ({date.stringTime})</span></p>
                <p className="vk-message__info-text">{message.text}</p>
                {message.attachments.length !== 0 &&
                    <div className="vk-message__info-attachments flex-row">
                        {message.attachments.map((attach, index) => {
                            if (attach.type === "photo") {
                                return <img key={attach.photo.id} src={attach.photo.sizes[1].url} alt="attachment" />
                            }
                            return null
                        })}
                    </div>
                }
            </div>
        </button>
    )
}
