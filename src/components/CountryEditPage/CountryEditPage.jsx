import { useEffect, useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import { CONSTS, setPageTitle, setPageLoading } from "../Global"
import { formValidate, sendForm } from "./CountryEdit"
import imgAt from "../../assets/icons/At.svg"


import "./CountryEditPage.css"

export default function CountryEditPage() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {setPageTitle(Context.userData.country_id ? "Изменение страны" : "Создание страны")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()

    const [errorText, setErrorText] = useState("") // Текст ошибки
    const [inputError, setInputError] = useState() // Отображать ли ошибку инпута
    const [disableSubmitButton, setDisableSubmitButton] = useState(true) // Состояние кнопки сохранения

    const [bioLength, setBioLength] = useState(0);
    const [photoPreview, setPhotoPreview] = useState("")

    const nameInput = useRef()
    const tagInput = useRef()
    const photoInput = useRef()
    const bioInput = useRef()

    useEffect(() => {
        nameInput.current.value = Context.userData.country_name
        tagInput.current.value = Context.userData.country_tag.substr(1);

        photoInput.current.value = Context.userData.country_photo
        checkImageSource(photoInput.current.value) // Обновляем превью картинки

        // bioInput.current.value = Context.userData.country_bio_.replaceAll("<br>","\n")
        bioInput.current.value = Context.userData.country_bio
        setBioLength(bioInput.current.value.length) // Обновляем значение длины описания
        
        handleInputUpdate()
    }, [Context.userData])


    // Проверка существования картинки
    function checkImageSource(src) {
        if (src) {
            const img = new Image();
            img.src = src;
            
            img.onload = () => {
                if (img.naturalWidth < CONSTS.photoPxMin // Если картинка больше или меньше заданных значений
                    || img.naturalHeight < CONSTS.photoPxMin
                    || img.naturalWidth > CONSTS.photoPxMax
                    || img.naturalHeight > CONSTS.photoPxMax) {
                    setErrorText("Не удалось загрузить картинку")
                    setPhotoPreview("")
                    setInputError("photo")
                    return
                }

                // Если размер подходит - ставим превью
                setPhotoPreview(src)
            }

            img.onerror = () => {
                setErrorText("Не удалось загрузить картинку")
                setPhotoPreview("")
                setInputError("photo")
            }
        } else {
            setPhotoPreview("")
        }
    }


    // При обновлении любого из инпутов
    function handleInputUpdate() {
        setErrorText("")
        setInputError()
        setDisableSubmitButton(nameInput.current.value.length < CONSTS.countryTitleMin) // Если меньше 1 символа в названии страны
        
        tagInput.current.value = tagInput.current.value.replaceAll(" ", "_")
    }

    // Ивент submit у формы создания/изменения страны
    function submitForm() {
        handleInputUpdate() // Убираем отображение ошибки

        let formName = nameInput.current.value
        let formTag = tagInput.current.value
        let formPhoto = photoInput.current.value
        let formBio = bioInput.current.value

        // Если тег пустой - ставим по умолчанию
        if (!formTag) formTag = Context.userData.country_id || "c" + Context.userData.id

        // Если фото пустое - загружаем стандартное
        if (!photoPreview) {
            formPhoto = "https://sun9-67.userapi.com/impg/X1_O1m3fnSygoDxCy1F0E2XwkkVM3gnJoyq9Ag/zdkh1clrZtk.jpg?size=1200x800&quality=96&sign=a947569cd58dd93b7681dc5c0dbf03dc&type=album"
        }

        formValidate(formName, formTag, formPhoto, formBio)
        .then(() => {
            // Отключаем кнопку только в случае если прошло все проверки
            setDisableSubmitButton(true)
            setPageLoading()
            return true // И возвращаем успех
        })
        .catch(error => { // Если ошибка во время валидации
            setErrorText(error.text)
            setInputError(error.input)
        })
        .then(resolved => {
            // Если не было ошибки - отправляем
            if (resolved) {
                sendForm(Context, formName, formTag, formPhoto, formBio)
                .then(() => { // Если успешно сохранились изменения
                    setPageLoading(false)
                    Navigate("/country/c" + Context.userData.id)
                })
                .catch(error => { // Если ошибка
                    setErrorText(error)
                    if (error === "Введенный тег занят") setInputError("tag")

                    setDisableSubmitButton(false)
                    setPageLoading(false)
                })
            }
        })
    }

    return (
        <article>
            {/* Добавить изменение надписи на "Создание страны" если страна у юзера пустая */}
            <h4 className="page-title">{`h/country/${Context.userData.country_id ? "edit" : "create"}`}</h4>

            <section className="flex-col country-edit">
                <CustomInput label="ID Страны">
                    <input
                        type="text"
                        id="form-id"
                        value={Context.userData.country_id || "c" + Context.userData.id}
                        readOnly
                        required
                    />
                </CustomInput>

                <CustomInput label="Название страны" error={inputError === "title"}>
                    <input
                        ref={nameInput}
                        type="text"
                        id="form-title"
                        maxLength={CONSTS.countryTitleMax}
                        onInput={handleInputUpdate}
                        required
                    />
                </CustomInput>
                <small className="text-gray">
                    <p className="text-red" style={{display: "inline"}}>*</p> Обязательное поле
                    <br/>• Длина от {CONSTS.countryTitleMin} до {CONSTS.countryTitleMax} символов
                </small>

                <CustomInput label="Тег страны" error={inputError === "tag"} src={imgAt}>
                    <input
                        ref={tagInput}
                        type="text"
                        id="form-tag"
                        maxLength={CONSTS.countryTagMax}
                        onInput={handleInputUpdate}
                        onBlur={() => {
                            // Если строка пустая - ставим id страны
                            if (tagInput.current.value === "") {
                                tagInput.current.value = Context.userData.country_id || "c" + Context.userData.id
                            }
                        }}
                        required
                    />
                </CustomInput>
                <small className="text-gray">
                    • Длина до {CONSTS.countryTagMax} символов
                    <br/>• Без пробелов
                    <br/>• Доступные символы: Латиница, цифры, - и _
                </small>

                <CustomInput label="Ссылка на картинку страны" error={inputError === "photo"}>
                    <input
                        ref={photoInput}
                        type="text"
                        id="form-photo"
                        maxLength={CONSTS.photoMax}
                        onInput={() => {
                            checkImageSource(photoInput.current.value) // Проверяем картинку
                            handleInputUpdate() // Так же обновляем все поля
                        }}
                        required
                    />
                </CustomInput>

                <small className="text-gray">
                    • Размер картинки от {CONSTS.photoPxMin}px/{CONSTS.photoPxMin}px до {CONSTS.photoPxMax}px/{CONSTS.photoPxMax}px
                    <br/>• Замена на стандартную картинку если поле пустое
                </small>
                {photoPreview &&
                    <img src={photoPreview} alt="preview" draggable="false" />
                }
                
                <CustomInput label={`Описание страны (${bioLength} / ${CONSTS.countryBioMax})`} error={inputError === "bio"}>
                    <textarea
                        ref={bioInput}
                        id="form-bio"
                        maxLength={CONSTS.countryBioMax}
                        onInput={() => {
                            setBioLength(bioInput.current.value.length) // Обновляем значение длины описания
                            handleInputUpdate() // Так же обновляем все поля
                        }}
                        required 
                    ></textarea>
                </CustomInput>
                
                {errorText &&
                    <p className="text-red">{errorText}</p>
                }

                <button onClick={submitForm} disabled={disableSubmitButton} className="green">Сохранить</button>
            </section>
        </article>
    )
}
