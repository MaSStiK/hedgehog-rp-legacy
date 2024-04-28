import { useState } from "react"
import $ from "jquery"

import "./CustomInput.css"


/* 
Пример использования

<CustomInput label="Пример использования">
    <input
        ref={exampleInput}
        type="text"
        className={exampleInputError ?  "error" : null}
        onChange={() => {handler}}
        required
    />
</CustomInput>

required - ОБЯЗАТЕЛЕН !!!
*/


// Кастомный инпут с label который заменяет placeholder и при активации label переносится на верхнюю часть инпута
export default function CustomInput({
    id,
    className,
    style,
    label,
    children,
    ...props
}) {
    // const [showPassword, setShowPassword] = useState(false)

    // function toggleShowPassword() {
    //     setShowPassword(!showPassword)

    //     // Не совсем правильно, но работает
    //     let child = $("#" + props.children.props.id)
    //     if (child.attr("type") === "password") {
    //         child.attr("type", "text")
    //     } else {
    //         child.attr("type", "password")
    //     }
    // }

    return (
        <div
            id={id || ""}
            className={`custom-input-wrapper ${className || ""}`}
            style={style}
        >
            {/* Передаваемый инпут */}
            {children}

            {/* Его label / placeholder */}
            <label htmlFor={children.props.id}>{label}</label>

            {/* Для инпута с паролем кнопка показа пароля */}
            {/* {props.password &&
                <button type="button" onClick={toggleShowPassword}>
                    {showPassword ? <img src={imgEyeClosed} alt="show-password" /> : <img src={imgEyeOpen} alt="hide-password" />}
                </button>
            } */}
        </div>
    )
}