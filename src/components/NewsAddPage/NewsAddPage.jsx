import { useEffect, useContext, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import ButtonImage from "../ButtonImage/ButtonImage"
import { CONFIG, setPageTitle, setPageLoading, timestampToDate } from "../Global"
import { formValidate, sendForm } from "./NewsAdd.js"
import CheckImgSrc from "../CheckImgSrc.js"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import imgAdd from "../../assets/svg/Plus.svg"
import imgCross from "../../assets/svg/Cross.svg"

import "./NewsAddPage.css"

export default function NewsAddPage() {
    useEffect(() => {setPageTitle("Создание поста")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()
    const Location = useLocation()

    const [errorText, setErrorText] = useState("") // Текст ошибки
    const [inputError, setInputError] = useState() // Отображать ли ошибку инпута
    const [TextLength, setTextLength] = useState(0) // Длина поля с текстом
    const [photoPreview, setPhotoPreview] = useState("") // Превью картинки
    const [attachments, setAttachments] = useState([]) // Список картинок
    const [disableAddButton, setDisableAddButton] = useState(true) // Состояние кнопки Добавления картинки
    const [publicationDate, setPublicationDate] = useState({}) // Дата публикации (добавляем три нуля)
    const [selectedDate, setSelectedDate] = useState("now")
    const [disableSubmitButton, setDisableSubmitButton] = useState(true) // Состояние кнопки сохранения
    
    const titleInput = useRef()
    const textInput = useRef()
    const photoInput = useRef()

    // Если пост создается из сообщения
    useEffect(() => {
        if (Location.state) {
            // Заполняем поля
            textInput.current.value = Location.state.text
            setSelectedDate("timestamp") // Устанавливаем выбор по timestamp
            setPublicationDate(timestampToDate(Location.state?.date * 1000))
    
            // Собираем массив картинок (Добавляем ко времени их порядковый номер)
            let attachmentsArray = []
            Location.state.attachments.forEach((attach, index) => {
                if (attach.type === "photo") {
                    // Получаем самый большой размер картинки
                    attach.photo.sizes.sort((a, b) => b.width - a.width).sort((a, b) => b.height - a.height)
                    attachmentsArray.push({id: Date.now() + index, url: attach.photo.sizes[0].url})
                }
            })
            setAttachments(attachmentsArray)
        }
    }, [Location.state])

    // При обновлении любого из инпутов
    function handleInputUpdate() {
        setErrorText("")
        setInputError()
        setDisableSubmitButton(titleInput.current.value.length < CONFIG.COUNTRY_TITLE_MIN) // Если меньше 1 символа в заголовке поста
    }

    // Проверка существования картинки
    function checkPhoto(imageSrc) {
        // При обновлении значения - блокируем кнопку добавления картинки
        setDisableAddButton(true)

        if (imageSrc) {
            CheckImgSrc(imageSrc)
            .then(src => {
                setPhotoPreview(src)
                setDisableAddButton(false)
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

    // Добавление картинки
    function addAttachment() {
        setDisableAddButton(true) // Отключаем кнопку Добавления
        let attachSrc = photoInput.current.value // Получаем ссылку
        setAttachments(prevState => [...prevState, {id: Date.now(), url: attachSrc}]) // Сохраняем ссылку
        setPhotoPreview("") // Убираем превью
        photoInput.current.value = "" // Сбрасываем значение поля Ссылки на картинку
    }

    // Ивент submit у формы создания поста
    function submitForm() {
        handleInputUpdate() // Сброс всех ошибок

        let formTitle = titleInput.current.value
        let formText = textInput.current.value
        // let formPhoto = countryPhotoInput.current.value

        formValidate(formTitle, formText, attachments)
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
                // Если выбрана дата публикации сейчас - то ставим текущую дату, иначе - дата сообщения
                let _publicationDate = selectedDate === "now" ? Date.now() : Location.state?.date * 1000
                
                sendForm(Context, formTitle, formText, attachments, _publicationDate)
                .then(() => { // Если успешно сохранились изменения
                    setPageLoading(false)
                    Navigate("/news")
                })
                .catch(error => { // Если ошибка
                    setErrorText(error)
                    setDisableSubmitButton(false)
                    setPageLoading(false)
                })
            }
        })
    }

    return (
        <article>
            <h4 className="page-title">h/news/add</h4>

            <section className="flex-col news-add">
                <CustomInput label="Заголовок поста" error={inputError === "title"}>
                    <input
                        ref={titleInput}
                        type="text"
                        id="form-title"
                        maxLength={CONFIG.POST_TITLE_MAX}
                        onInput={handleInputUpdate}
                        required
                    />
                </CustomInput>
                <small className="text-gray">
                    <p className="text-red" style={{display: "inline"}}>*</p> Обязательное поле
                    <br />• Длина от {CONFIG.POST_TITLE_MIN} до {CONFIG.POST_TITLE_MAX} символов
                </small>

                <CustomInput label={`Текст поста (${TextLength} / ${CONFIG.POST_TEXT_MAX})`} error={inputError === "text"}>
                    <textarea
                        ref={textInput}
                        id="form-text"
                        maxLength={CONFIG.POST_TEXT_MAX}
                        onInput={() => {
                            setTextLength(textInput.current.value.length) // Обновляем значение длины текста
                            handleInputUpdate() // Так же обновляем все инпуты
                        }}
                        required 
                    ></textarea>
                </CustomInput>
                
                {/* Отображение блок добавления картинок */}
                {attachments.length < 10 &&
                    <>
                        <div className="flex-row news-add__input-row">
                            <CustomInput label="Ссылка на картинку" error={inputError === "photo"}>
                                <input
                                    id="form-photo"
                                    ref={photoInput}
                                    type="text"
                                    maxLength={CONFIG.PHOTO_LINK_MAX}
                                    onInput={() => {
                                        checkPhoto(photoInput.current.value)
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
                            • Максимум {CONFIG.POST_ATTACH_MAX} картинок
                            <br /> • Размер картинки от {CONFIG.PHOTO_PX_MIN}px/{CONFIG.PHOTO_PX_MIN}px до {CONFIG.PHOTO_PX_MAX}px/{CONFIG.PHOTO_PX_MAX}px
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
                    </>
                }

                {/* Отображение загруженных картинок */}
                {attachments.length !== 0 &&
                    <>  
                        <hr />
                        <div className="flex-row news-add__attachments">
                            {attachments.map((attach) => {
                                return <div className="flex-col" key={attach.id}>
                                    <ImageFullscreen>
                                        <img src={attach.url} alt="preview" />
                                    </ImageFullscreen>

                                    <ButtonImage
                                        src={imgCross}
                                        alt="image-delete"
                                        className="red"
                                        onClick={() => setAttachments(attachments.filter(el => el.id !== attach.id))}
                                    />
                                </div>
                            })}
                        </div>
                        <hr />
                    </>
                }
                
                {/* Предупреждение появляется когда максимум картинок */}
                {attachments.length === 10 &&
                    <small className="text-gray">• Достигнуто максимальное кол-во картинок</small>
                }

                {Location.state?.date &&
                    <>
                        <p>Отображаемое дата публикации:</p>
                        <div className="settings__radio-input flex-row">
                            <input
                                id="publication-timestamp"
                                type="radio"
                                name="publication-date"
                                onChange={() => setSelectedDate("timestamp")}
                                defaultChecked={true}
                            />
                            <label htmlFor="publication-timestamp">Дата отправки сообщения<br />({publicationDate.stringTime} {publicationDate.stringDate})</label>
                        </div>
                        <div className="settings__radio-input flex-row">
                            <input
                                id="publication-now"
                                type="radio"
                                name="publication-date"
                                onChange={() => setSelectedDate("now")}
                            />
                            <label htmlFor="publication-now">Сейчас</label>
                        </div>
                    </>
                }
                
                {errorText &&
                    <p className="text-red" style={{textAlign: "center"}}>{errorText}</p>
                }

                <button onClick={submitForm} disabled={disableSubmitButton} className="green">Создать</button>
            </section>
        </article>
    )
}