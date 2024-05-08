import { useEffect, useContext, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import ButtonImage from "../ButtonImage/ButtonImage"
import { CONSTS, setPageTitle, setPageLoading } from "../Global"
import { GSAPI } from "../API"
import imgAdd from "../../assets/icons/Add.svg"
import imgCross from "../../assets/icons/Cross.svg"

import "./NewsAddPage.css"
import "./NewsAddPage-phone.css"


export default function NewsAddPage() {
    useEffect(() => {setPageTitle("Создание новости")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()

    const [postTextLength, setPostTextLength] = useState(0)
    const [postPhotoPreview, setPostPhotoPreview] = useState("")
    const [showAttachments, setShowAttachments] = useState(true) // Показывать ли блок добавления картинок
    const [attachments, setAttach] = useState([]) // Список картинок

    const [errorText, setErrorText] = useState("") // Текст ошибки
    const [titleInputError, setTitleInputError] = useState(false) // Отображать ли ошибку инпута Названия страны
    const [textInputError, setTextInputError] = useState(false) // Отображать ли ошибку инпута Названия страны
    const [photoInputError, setPhotoInputError] = useState(false) // Отображать ли ошибку инпута Ссылка на фото
    const [disableAddButton, setDisableAddButton] = useState(true) // Состояние кнопки Добавления картинки
    const [disableSubmitButton, setDisableSubmitButton] = useState(true) // Состояние кнопки сохранения
    
    const postTitleInput = useRef()
    const postTextInput = useRef()
    const postPhotoInput = useRef()

    


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
                    setPhotoInputError(true)
                    setPostPhotoPreview("")
                    return
                }

                // Если размер подходит - ставим превью
                setPostPhotoPreview(src)
                setDisableAddButton(false)
            }

            img.onerror = () => {
                setErrorText("Не удалось загрузить картинку")
                setPhotoInputError(true)
                setPostPhotoPreview("")
            }
        } else {
            setPostPhotoPreview("")
        }
    }


    // При обновлении любого из инпутов
    function handleInputUpdate() {
        setErrorText("")
        setTitleInputError(false)
        setTextInputError(false)
        setPhotoInputError(false)
        setDisableSubmitButton(postTitleInput.current.value.length < CONSTS.countryTitleMin) // Если меньше 1 символа в заголовке поста
    }

    function addAttachment() {
        // Отключаем кнопку и превью
        setDisableAddButton(true)

        let attachSrc = postPhotoInput.current.value
        setAttach(prevState => [...prevState, {id: Date.now(), url: attachSrc}])
        setPostPhotoPreview("")
        postPhotoInput.current.value = ""
    }

    useEffect(() => {
        if (attachments.length < 10) {
            setShowAttachments(true)
        } else {
            setShowAttachments(false)
        }
    }, [attachments])


    // Ивент submit у формы создания поста
    function submitForm() {
        handleInputUpdate() // Сброс всех ошибок

        let formTitle = postTitleInput.current.value
        let formText = postTextInput.current.value
        // let formPhoto = countryPhotoInput.current.value


        // Проверка длины Заголовка
        if (formTitle.length < CONSTS.postTitleMin || formTitle.length > CONSTS.postTitleMax) {
            setErrorText(formTitle.length < CONSTS.postTitleMin
                ? `Заголовок меньше ${CONSTS.postTitleMin} символов`
                : `Заголовок больше ${CONSTS.postTitleMax} символов`
            )
            setTitleInputError(true)
            return
        }


        // Проверка длины Текста
        if (formText.length > CONSTS.postTextMax) {
            setErrorText(`Текст больше ${CONSTS.postTextMax} символов`)
            setTextInputError(true)
            return
        }

        // Проверка длины фото
        if (attachments.length > CONSTS.attachmentsCountMax) {
            setErrorText(`Картинок больше ${CONSTS.attachmentsCountMax}`)
            setPhotoInputError(true)
            return
        }

        // Отключаем кнопку только в случае если прошло все проверки
        setDisableSubmitButton(true)
        setPageLoading()

        // Дата создания
        let dateNow = Date.now()

        // Данные нового пользователя
        const newPostData = {
            country_id: Context.userData.country_id, // id страны
            post_id: Context.userData.country_id + "_" + dateNow, // id поста
            post_title: formTitle, // Заголовок поста
            post_text: formText, // Текст поста
            attachments: JSON.stringify(Array.from(attachments, (attach) => attach.url)), // Прикрепленные картинки
            timestamp: dateNow // Дата создания поста
        }

        GSAPI("POSTaddPost", {data: JSON.stringify(newPostData), token: Context.userData.token}, (data) => {
            console.log("GSAPI: POSTaddPost");

            // Если не удалось сохранить
            if (!data.success || !Object.keys(data).length) {
                setErrorText(`Произошла непредвиденная ошибка!`)
                setDisableSubmitButton(false)
                setPageLoading(false)
                return
            }

            let posts = [...Context.posts]
            posts.unshift(newPostData)
            Context.setPosts(posts)

            Navigate("/news")

            setPageLoading(false)
        })
    }

    return (
        <article>
            <h4 className="page-title">h/news/add</h4>

            <section className="flex-col news-add">
                <CustomInput label="Заголовок новости" error={titleInputError}>
                    <input
                        ref={postTitleInput}
                        type="text"
                        id="form-title"
                        maxLength={CONSTS.postTitleMax}
                        onInput={handleInputUpdate}
                        required
                    />
                </CustomInput>
                <small className="text-gray">
                    <p className="text-red" style={{display: "inline"}}>*</p> Обязательное поле
                    <br/>• Длина от {CONSTS.postTitleMin} до {CONSTS.postTitleMax} символов
                </small>

                <CustomInput label={`Текст новости (${postTextLength} / ${CONSTS.postTextMax})`}
                    error={textInputError}
                >
                    <textarea
                        ref={postTextInput}
                        id="form-text"
                        maxLength={CONSTS.postTextMax}
                        onInput={() => {
                            setPostTextLength(postTextInput.current.value.length) // Обновляем значение длины текста
                            handleInputUpdate() // Так же обновляем все инпуты
                        }}
                        required 
                    ></textarea>
                </CustomInput>
                <small className="text-gray">• Длина до {CONSTS.postTextMax} символов</small>
                
                {/* Отображение блок добавления картинок */}
                {showAttachments &&
                    <>
                        <div className="news-add__input-row">
                            <CustomInput label="Ссылка на картинку" error={photoInputError}>
                                <input
                                    id="form-photo"
                                    ref={postPhotoInput}
                                    type="text"
                                    maxLength={CONSTS.photoMax}
                                    onInput={() => {
                                        checkImageSource(postPhotoInput.current.value)
                                        handleInputUpdate() // Так же обновляем все инпуты
                                    }}
                                    required
                                />
                            </CustomInput>

                            <ButtonImage
                                src={imgAdd}
                                alt="image-add"
                                text="Добавить"
                                className="green"
                                onClick={addAttachment}
                                disabled={disableAddButton}
                            />
                        </div>
                        <small className="text-gray">
                            • Длина до {CONSTS.photoMax} символов
                            <br/>• Размер картинки от {CONSTS.photoPxMin}px/{CONSTS.photoPxMin}px до {CONSTS.photoPxMax}px/{CONSTS.photoPxMax}px
                            <br/>• Максимум {CONSTS.attachmentsCountMax} картинок
                        </small>
                        {postPhotoPreview &&
                            <img src={postPhotoPreview} alt="preview" />
                        }
                    </>
                }

                {/* Отображение загруженных картинок */}
                {attachments.map((attach) => {
                    return <div className="news-add__attachment-preview" key={attach.id}>
                        <img src={attach.url} alt="preview" />

                        <ButtonImage
                            src={imgCross}
                            alt="image-delete"
                            text="Удалить"
                            className="green"
                            onClick={() => setAttach(attachments.filter(el => el.id !== attach.id))}
                        />
                    </div>
                })}
                
                {errorText &&
                    <p className="text-red">{errorText}</p>
                }

                <button onClick={submitForm} disabled={disableSubmitButton} className="green">Создать</button>
            </section>
        </article>
    )
}
