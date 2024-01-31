import "./ButtonImage.css"

export default function ButtonImage(props) {
    return (
        <button id={props.id || ""} 
            className={`button-image tp ${props.className || ""}`}
            onClick={props.onClick} 
            style={props.style} >

            <img src={props.src || ""} alt={props.alt || ""} />

            {props.text &&
                <p>{props.text}</p>
            }
        </button>
    )
}