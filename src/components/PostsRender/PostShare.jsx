import ButtonImage from "../ButtonImage/ButtonImage"
import imgCopy from "../../assets/svg/Copy.svg"
import imgVk from "../../assets/images/vk.svg"

import "./PostShare.css"

export default function PostShare(Context, postId, postTitle, postImg) {
    // Отправляем и закрываем модальное окно
    function shareVK() {
        
        let url = "https://vk.com/share.php"
        url += "?url=" + encodeURIComponent("https://hedgehog-rp.ru/news/" + postId)
        url += "&title=" + encodeURIComponent(postTitle)
        url += "&image=" + encodeURIComponent(postImg)
        url += "&noparse=true"

        window.open(url, "", "toolbar=0,status=0,popup=1,width=500,height=500")
        Context.setModal({}) // Закрытие модального окна
    }

    // Копируем ссылку и закрываем модальное окно
    function copyLink() {
        navigator.clipboard.writeText(window.location.origin + "/news/" + postId)
        Context.setModal({}) // Закрытие модального окна
    }

    Context.setModal(
        <div className="post-share flex-col">
            <h3 className="post-share__title">Поделиться постом</h3>
            <ButtonImage
                src={imgVk}
                alt="vk"
                className="tp"
                text="Поделиться в вк"
                title="Поделиться новостью в вк"
                onClick={shareVK}
            />
            <ButtonImage
                src={imgCopy}
                alt="copy"
                className="tp"
                text="Скопировать ссылку"
                title="Скопировать ссылку на пост"
                onClick={copyLink}
            />
        </div>
    )
}