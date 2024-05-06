import "./CustomInput.css"
import "./CustomInputImg.css"


/* 
Пример использования

<CustomInput label="Пример использования" error={exampleInputError}>
    <input
        ref={exampleInput}
        type="text"
        onChange={() => {handler}}
        required
    />
</CustomInput>

required - ОБЯЗАТЕЛЕН !!!
*/


// Кастомный инпут с label который заменяет placeholder и при активации label переносится на верхнюю часть инпута
export default function CustomInput({
    id,
    className="",
    style,
    label="Пример заголовка",
    error,
    src,
    alt="input-image",
    children
}) {
    // Добавляем стиль-модификатор перед передаваемыми классами
    if (src) className = "custom-input_img " + className
    if (error) className = "error " + className
    return (
        <div
            id={id}
            className={`custom-input ${className}`}
            style={style}
        >
            {/* Передаваемый инпут */}
            {children}

            {/* Картинка справа если ее передают */}
            {src && <img src={src} alt={alt} draggable="false" />}

            {/* Его label / placeholder */}
            <label htmlFor={children.props.id}>{label}</label>
        </div>
    )
}