import "./ButtonIcon.css"

export default function ButtonIcon(props) {
    return (
        <button id={props.id} 
            className={`button-icon ${props.className}`}
            onClick={props.onClick} 
            style={props.style} >

            <img src={props.src} alt={props.alt} />
        </button>
    )
}

ButtonIcon.defaultProps = {
    className: "",
    id: "",
    src: "",
    alt: "",
}