// import imgBasePhoto from "../../assets/replace/base-photo-empty.png"

import "./ButtonProfile.css"

export default function ButtonProfile(props) {
    return (
        <button id={props.id} 
            className={`button-profile ${props.type ? props.type : null} ${props.className}`} 
            onClick={props.onClick} 
            style={props.style} >

            {props.src &&
                <img src={props.src} alt="userpic" />
            }
            <div className={`button-profile__text ${props.src ? null : "button-profile__text-padding"}`}>
                <p className="text-cut">{props.text}</p>
                {props.subText && // Если сабтекст не указан (у страны) - рендерим только основной текст по центру
                    <small className="text-cut text-gray">{props.subText}</small>
                }
            </div>
        </button>
    )
}

ButtonProfile.defaultProps = {
    className: "",
    id: "",
    // type: "", // По умолчанию тип кнопки не задан. Используемые типы: tp
    src: "",
    text: "",
    subText: "",
}