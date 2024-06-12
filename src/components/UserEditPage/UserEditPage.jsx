import { useEffect, useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import { CONFIG, setPageTitle, setPageLoading } from "../Global"
import { formValidate, sendForm } from "./UserEdit"
import CheckImgSrc from "../CheckImgSrc.js"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import imgAt from "../../assets/icons/At.svg"

import "./UserEditPage.css"

export default function UserEditPage() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {setPageTitle("Изменение профиля")}, [])
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
        nameInput.current.value = Context.userData.name
        tagInput.current.value = Context.userData.tag.substr(1);

        photoInput.current.value = Context.userData.photo
        checkPhoto(photoInput.current.value) // Обновляем превью картинки

        bioInput.current.value = Context.userData.bio
        setBioLength(bioInput.current.value.length) // Обновляем значение длины описания
        
        handleInputUpdate()
    }, [Context.userData])


    // Проверка существования картинки
    function checkPhoto(imageSrc) {
        if (imageSrc) {
            CheckImgSrc(imageSrc)
            .then(src => {
                setPhotoPreview(src)
            })
            .catch(error => {
                setErrorText(error)
                setInputError("photo")
                setPhotoPreview("")
            })
        } else {
            setPhotoPreview("")
        }
    }


    // При обновлении любого из инпутов
    function handleInputUpdate() {
        setErrorText("")
        setInputError()
        setDisableSubmitButton(nameInput.current.value.length < CONFIG.USER_NAME_MIN) // Если меньше 1 символа в имени
        
        tagInput.current.value = tagInput.current.value.replaceAll(" ", "_")
    }

    // Ивент submit у формы изменения профиля
    function submitForm() {
        handleInputUpdate() // Убираем отображение ошибки

        let formName = nameInput.current.value
        let formTag = tagInput.current.value
        let formPhoto = photoInput.current.value
        let formBio = bioInput.current.value

        // Если тег пустой - ставим по умолчанию
        if (!formTag) formTag = Context.userData.id

        // Если фото пустое - загружаем стандартное
        if (!photoPreview) {
            formPhoto = "https://sun9-31.userapi.com/impg/G2LIF9CtQnTtQ4P9gRxJmvQAa1_64hPsOAe4sQ/WTSvqWbnyRw.jpg?size=427x320&quality=96&sign=10878b9fda054eedba3ee2c40fda9504&type=album"
        }

        formValidate(formName, formTag, formPhoto, formBio)
        .then(() => {
            // Отключаем кнопку только в случае если прошло все проверки
            setDisableSubmitButton(true)
            setPageLoading()
            return true // И возвращаем успех (Это тут нужно что бы перепрыгнуть на код ниже catch)
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
                    Navigate("/user/" + Context.userData.id)
                })
                .catch(error => { // Если ошибка
                    setErrorText(error)
                    if (error === "Введенный тег занят") setInputError("tag") // Если ошибка связана с тегом
                    setDisableSubmitButton(false)
                    setPageLoading(false)
                })
            }
        })
    }

    return (
        <article>
            <h4 className="page-title">h/user/edit</h4>

            <section className="flex-col user-edit">
                <CustomInput label="ID Профиля">
                    <input
                        type="text"
                        id="form-id"
                        value={Context.userData.id}
                        readOnly
                        required
                    />
                </CustomInput>

                <CustomInput label="Отображаемое имя" error={inputError === "name"}>
                    <input
                        ref={nameInput}
                        type="text"
                        id="form-name"
                        maxLength={CONFIG.USER_NAME_MAX}
                        onInput={handleInputUpdate}
                        required
                    />
                </CustomInput>
                <small className="text-gray">
                    <p className="text-red" style={{display: "inline"}}>*</p> Обязательное поле
                    <br />• Длина от {CONFIG.USER_NAME_MIN} до {CONFIG.USER_NAME_MAX} символов
                </small>

                <CustomInput label="Тег профиля" error={inputError === "tag"} src={imgAt}>
                    <input
                        ref={tagInput}
                        type="text"
                        id="form-tag"
                        maxLength={CONFIG.USER_TAG_MAX}
                        onInput={handleInputUpdate}
                        onBlur={() => {
                            // Если строка пустая - ставим id
                            if (tagInput.current.value === "") {
                                tagInput.current.value = Context.userData.id
                            }
                        }}
                        required
                    />
                </CustomInput>
                <small className="text-gray">
                    • Длина до {CONFIG.USER_TAG_MAX} символов
                    <br />• Без пробелов
                    <br />• Доступные символы: Латиница, цифры, - и _
                </small>

                <CustomInput label="Ссылка на картинку профиля" error={inputError === "photo"}>
                    <input
                        ref={photoInput}
                        type="text"
                        id="form-photo"
                        maxLength={CONFIG.PHOTO_LINK_MAX}
                        onInput={() => {
                            checkPhoto(photoInput.current.value) // Проверяем картинку
                            handleInputUpdate() // Так же обновляем все поля
                        }}
                        required
                    />
                </CustomInput>
                <small className="text-gray">
                    • Размер картинки от {CONFIG.PHOTO_PX_MIN}px/{CONFIG.PHOTO_PX_MIN}px до {CONFIG.PHOTO_PX_MAX}px/{CONFIG.PHOTO_PX_MAX}px
                    <br />• Будет установлено стандартная картинка если поле пустое
                </small>
                {photoPreview &&
                    <>
                        <p className="news-add__preview-text">Предпросмотр картинки</p>
                        <div className="news-add__preview">
                            <ImageFullscreen>
                                <img src={photoPreview} alt="preview" />
                            </ImageFullscreen>
                        </div>
                    </>
                }
                
                <CustomInput label={`Описание профиля (${bioLength} / ${CONFIG.USER_BIO_MAX})`} error={inputError === "bio"}>
                    <textarea
                        ref={bioInput}
                        id="form-bio"
                        maxLength={CONFIG.USER_BIO_MAX}
                        onInput={() => {
                            setBioLength(bioInput.current.value.length) // Обновляем значение длины описания
                            handleInputUpdate() // Так же обновляем все поля
                        }}
                        required 
                    ></textarea>
                </CustomInput>
                
                {errorText &&
                    <p className="text-red" style={{textAlign: "center"}}>{errorText}</p>
                }

                <button onClick={submitForm} disabled={disableSubmitButton} className="green">Сохранить</button>
            </section>
        </article>
    )
}