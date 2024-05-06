import imgReplaceMe from "../../assets/icons/ReplaceMe.svg"
import "./ButtonImage.css"

// Кнопка с картинкой, но так же есть возможность отобразить текст после картинки
export default function ButtonImage({
    id,
    className="",
    style,
    onClick,
    src=imgReplaceMe,
    alt="button-image",
    text,
    width100,
    atStart,
    disabled
}) {
    // Добавляем стиль-модификатор перед передаваемыми классами
    if (width100) className = "button-image_width100 " + className
    if (atStart) className = "button-image_atStart " + className
    return (
        <button
            id={id} 
            className={`button-image ${className}`}
            style={style}
            onClick={onClick} 
            disabled={disabled}
        >
            <img src={src} alt={alt} draggable="false" />

            {text && <p>{text}</p>}
        </button>
    )
}