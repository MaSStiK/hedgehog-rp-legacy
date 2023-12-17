import { useState } from "react"
import $ from "jquery"
import imgEyeOpen from "../../assets/icons/EyeOpen.svg"
import imgEyeClosed from "../../assets/icons/EyeClosed.svg"

import "./CustomInput.css"

export default function CustomInput(props) {
    const [showPassword, setShowPassword] = useState(false)
    const toggleShowPassword = () => {
        setShowPassword(!showPassword)

        // Не совсем правильно, но работает
        let child = $("#" + props.children.props.id)
        if (child.attr("type") === "password") {
            child.attr("type", "text")
        } else {
            child.attr("type", "password")
        }
    }

    return (
        <div className={`custom-input-wrapper ${props.password ? "custom-input-password" : null} ${props.className}`} style={props.style}>
            {props.children}
            <label htmlFor={props.children.props.id}>{props.label}</label>

            {/* Для инпута с паролем кнопка показа пароля */}
            {props.password &&
                <button type="button" onClick={toggleShowPassword}>
                    {showPassword ? <img src={imgEyeClosed} alt="show-password" /> : <img src={imgEyeOpen} alt="hide-password" />}
                </button>
            }
        </div>
    )
}

CustomInput.defaultProps = {
    className: "",
    password: null
}