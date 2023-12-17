import imgBasePhoto from "../../assets/replace/base-photo-empty.png"

import "./CustomButton.css"

export default function CustomButton(props) {
    return (
        <button id={props.id} className={`custom-button ${props.type ? props.type : null}`} 
            onClick={props.onClick} 
            style={props.style} 
            >
            <img src={props.src} alt="userpic" />
            <div className="custom-button__text">
                <p className="text-cut">{props.text}</p>
                {props.subText && // Если сабтекст не указан (у страны) - рендерим только основной текст по центру
                    <small className="text-cut text-gray">{props.subText}</small>
                }
            </div>
        </button>
    )
}

CustomButton.defaultProps = {
    id: "",
    src: imgBasePhoto,
    text: "",
    subText: ""
}