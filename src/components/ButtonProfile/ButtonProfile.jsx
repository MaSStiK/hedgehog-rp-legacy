// import imgBasePhoto from "../../assets/replace/base-photo-empty.png"

import "./ButtonProfile.css"

export default function ButtonProfile(props) {
    return (
        <button id={props.id || ""} 
            className={`button-profile ${props.className || ""}`} 
            onClick={props.onClick} 
            style={props.style} >

            {props.src &&
                <img src={props.src} alt="user-profile" />
            }
            
            {(props.text || props.subText) &&
                <div className="button-profile__text">
                    {props.text && // Если текст не указан, то не рендерим его
                        <p className="text-cut">{props.text}</p>
                    }

                    {props.subText && // Если сабтекст не указан, то не рендерим его
                        <small className="text-cut text-gray">{props.subText}</small>
                    }
                </div>
            }
        </button>
    )
}