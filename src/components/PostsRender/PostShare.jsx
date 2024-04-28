import ButtonImage from "../ButtonImage/ButtonImage"
import imgCopy from "../../assets/icons/Copy.svg"
import imgVk from "../../assets/tools/vk.png"


import "./PostShare-modal.css"

export default function PostShare(Context, postId, postTitle, postImg) {
    // Отправляем и закрываем модальное окно
    function shareVK() {
        
        let url = "https://vk.com/share.php"
        url += "?url=" + encodeURIComponent("https://masstik.github.io/hedgehog.rp/#/news/" + postId)
        url += "&title=" + encodeURIComponent(postTitle)
        url += "&image=" + encodeURIComponent(postImg)
        url += "&noparse=true"

        window.open(url, "", "toolbar=0,status=0,popup=1,width=500,height=500")
        Context.setModalData({}) // Закрытие модального окна
    }

    // Копируем ссылку и закрываем модальное окно
    function copyLink() {
        
        navigator.clipboard.writeText("https://masstik.github.io/hedgehog.rp/#/news/" + postId)
        Context.setModalData({}) // Закрытие модального окна
    }

    Context.setModalData(
        <div className="post-share flex-col">
            <h3 className="post-share__title">Поделиться новостью</h3>
            <ButtonImage
                className="tp"
                src={imgVk}
                text={"Поделиться в вк"}
                onClick={shareVK}
            />
            <ButtonImage
                className="tp"
                src={imgCopy}
                text={"Скопировать ссылку"}
                onClick={copyLink}
            />
        </div>
    )
}