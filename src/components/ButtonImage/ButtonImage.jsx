import "./ButtonImage.css"

// Кнопка с картинкой, но так же есть возможность отобразить текст после картинки
export default function ButtonImage({
    id,
    className,
    style,
    onClick,
    src,
    alt,
    text,
    width100,
    atStart,
    disabled,
    ...props
}) {
    return (
        <button
            id={id || ""} 
            className={`button-image ${width100 ? "button-image_width100" : ""} ${atStart ? "button-image_atStart" : ""} ${className || ""} `}
            style={style}
            onClick={onClick} 
            disabled={disabled}
        >
            <img src={src || ""} alt={alt || "button-image"} draggable="false" />

            {text && <p>{text}</p>}
        </button>
    )
}