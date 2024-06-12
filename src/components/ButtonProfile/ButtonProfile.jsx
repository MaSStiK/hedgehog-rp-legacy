import imgBasePhoto from "../../assets/replace/photo-empty.png"

import "./ButtonProfile.css"

// Большая кнопка с профилем или страной
export default function ButtonProfile({
    id,
    className="",
    style,
    onClick,
    src=imgBasePhoto,
    text,
    subText,
    preview
}) {
    // Добавляем стиль-модификатор перед передаваемыми классами
    if (preview) className = "button-profile_preview " + className// Предпросмотр кнопки профиля
    return (
        <button
            id={id} 
            className={`button-profile ${className}`} 
            style={style}
            onClick={onClick} 
        >
            <img src={src} alt="profile-icon" draggable="false" />
            
            {/* Если есть текст или subText - отображаем блок с текстом */}
            {(text || subText) &&
                <div className="button-profile__text">
                    {text && // Если текст не указан, то не рендерим его
                        <p className="text-cut">{text}</p>
                    }

                    {subText && // Если subText не указан, то не рендерим его
                        <small className="text-cut text-gray">{subText}</small>
                    }
                </div>
            }
        </button>
    )
}