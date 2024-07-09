import { useEffect, useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import { CONFIG, setPageTitle, setPageLoading } from "../Global"
import { formValidate, sendForm } from "./CountryEdit"
import CheckImgSrc from "../CheckImgSrc"
import Fullscreen from "../Fullscreen/Fullscreen"
import imgAt from "../../assets/svg/At.svg"

import "./CountryEditPage.css"

export default function CountryEditPage() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {setPageTitle(Context.UserData?.country_id ? "Изменение страны" : "Создание страны")}, [])
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
        nameInput.current.value = Context.UserData.country_name
        tagInput.current.value = Context.UserData.country_tag.substr(1);

        photoInput.current.value = Context.UserData.country_photo
        checkPhoto(photoInput.current.value) // Обновляем превью картинки

        // bioInput.current.value = Context.UserData.country_bio_.replaceAll("<br>","\n")
        bioInput.current.value = Context.UserData.country_bio
        setBioLength(bioInput.current.value.length) // Обновляем значение длины описания
        
        handleInputUpdate()
    }, [Context.UserData])


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
        setDisableSubmitButton(nameInput.current.value.length < CONFIG.COUNTRY_NAME_MIN) // Если меньше 1 символа в названии страны
        tagInput.current.value = tagInput.current.value.replaceAll(" ", "_") // Удаляем лишнии символы из тега
    }

    // Ивент submit у формы создания/изменения страны
    function submitForm() {
        handleInputUpdate() // Убираем отображение ошибки

        let formName = nameInput.current.value
        let formTag = tagInput.current.value
        let formPhoto = photoInput.current.value
        let formBio = bioInput.current.value

        // Если тег пустой - ставим по умолчанию
        if (!formTag) formTag = Context.UserData.country_id || "c" + Context.UserData.id

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
                    Navigate("/country/c" + Context.UserData.id)
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
            <h4 className="page-title">{`h/country/${Context.UserData?.country_id ? "edit" : "create"}`}</h4>

            <section className="flex-col country-edit">
                <CustomInput label="ID Страны">
                    <input
                        type="text"
                        id="form-id"
                        value={Context.UserData?.country_id || "c" + Context.UserData.id}
                        readOnly
                        required
                    />
                </CustomInput>

                <CustomInput label="Название страны" error={inputError === "title"}>
                    <input
                        ref={nameInput}
                        type="text"
                        id="form-title"
                        maxLength={CONFIG.COUNTRY_NAME_MAX}
                        onInput={handleInputUpdate}
                        required
                    />
                </CustomInput>
                <small className="text-gray">
                    <p className="text-red" style={{display: "inline"}}>*</p> Обязательное поле
                    <br />• Длина от {CONFIG.COUNTRY_NAME_MIN} до {CONFIG.COUNTRY_NAME_MAX} символов
                </small>

                <CustomInput label="Тег страны" error={inputError === "tag"} src={imgAt}>
                    <input
                        ref={tagInput}
                        type="text"
                        id="form-tag"
                        maxLength={CONFIG.COUNTRY_TAG_MAX}
                        onInput={handleInputUpdate}
                        onBlur={() => {
                            // Если строка пустая - ставим id страны
                            if (tagInput.current.value === "") {
                                tagInput.current.value = Context.UserData?.country_id || "c" + Context.UserData.id
                            }
                        }}
                        required
                    />
                </CustomInput>
                <small className="text-gray">
                    • Длина от {CONFIG.COUNTRY_TAG_MIN} до {CONFIG.COUNTRY_TAG_MAX} символов
                    <br />• Без пробелов
                    <br />• Доступные символы: Латиница, цифры, - и _
                </small>

                <CustomInput label="Ссылка на картинку страны" error={inputError === "photo"}>
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
                        <p className="country-edit__preview-text">Предпросмотр картинки</p>
                        <div className="country-edit__preview">
                            <Fullscreen>
                                <img src={photoPreview} alt="preview" />
                            </Fullscreen>
                        </div>
                    </>
                }
                
                <CustomInput label={`Описание страны (${bioLength} / ${CONFIG.COUNTRY_BIO_MAX})`} error={inputError === "bio"}>
                    <textarea
                        ref={bioInput}
                        id="form-bio"
                        maxLength={CONFIG.COUNTRY_BIO_MAX}
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
