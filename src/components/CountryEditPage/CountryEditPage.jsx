import { useEffect, useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import { CONSTS, setPageTitle, setPageLoading } from "../Global"
import { GSAPI } from "../API";
import imgAt from "../../assets/icons/At.svg"


import "./CountryEditPage.css"

export default function CountryEditPage() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {setPageTitle(Context.userData.country_id ? "Изменение страны" : "Создание страны")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()

    const [countryBioLength, setCountryBioLength] = useState(0);
    const [countryPhotoPreview, setCountryPhotoPreview] = useState("")

    const [errorText, setErrorText] = useState("") // Текст ошибки
    const [titleInputError, setTitleInputError] = useState(false) // Отображать ли ошибку инпута Названия страны
    const [tagInputError, setTagInputError] = useState(false) // Отображать ли ошибку инпута Названия страны
    const [bioInputError, setBioInputError] = useState(false) // Отображать ли ошибку инпута Описания
    const [photoInputError, setPhotoInputError] = useState(false) // Отображать ли ошибку инпута Ссылка на фото
    const [disableSubmitButton, setDisableSubmitButton] = useState(true) // Состояние кнопки сохранения

    const basePhotoSrc = "https://is.gd/fzchSz" // Сокращенная ссылка на базовое фото

    const countryTitleInput = useRef()
    const countryTagInput = useRef()
    const countryPhotoInput = useRef()
    const countryBioInput = useRef()

    useEffect(() => {
        countryTitleInput.current.value = Context.userData.country_title
        countryTagInput.current.value = Context.userData.country_tag.substr(1);

        countryPhotoInput.current.value = Context.userData.country_photo
        checkImageSource(countryPhotoInput.current.value) // Обновляем превью картинки

        // countryBioInput.current.value = Context.userData.country_bio_.replaceAll("<br>","\n")
        countryBioInput.current.value = Context.userData.country_bio
        setCountryBioLength(countryBioInput.current.value.length) // Обновляем значение длины описания
        
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
                    setCountryPhotoPreview("")
                    setPhotoInputError(true)
                    return
                }

                // Если размер подходит - ставим превью
                setCountryPhotoPreview(src)
            }

            img.onerror = () => {
                setErrorText("Не удалось загрузить картинку")
                setCountryPhotoPreview("")
                setPhotoInputError(true)
            }
        } else {
            setCountryPhotoPreview("")
        }
    }


    // При обновлении любого из инпутов
    function handleInputUpdate() {
        setErrorText("")
        setTitleInputError(false)
        setTagInputError(false)
        setBioInputError(false)
        setPhotoInputError(false)
        setDisableSubmitButton(countryTitleInput.current.value.length < CONSTS.countryTitleMin) // Если меньше 1 символа в названии страны
        
        countryTagInput.current.value = countryTagInput.current.value.replaceAll(" ", "_")
    }

    // Ивент submit у формы создания/изменения страны
    function submitForm() {
        handleInputUpdate() // Сброс всех ошибок

        let formTitle = countryTitleInput.current.value
        let formTag = countryTagInput.current.value
        let formPhoto = countryPhotoInput.current.value
        let formBio = countryBioInput.current.value


        // Проверка длины Названия
        if (formTitle.length < CONSTS.countryTitleMin || formTitle.length > CONSTS.countryTitleMax) {
            setErrorText(formTitle.length < CONSTS.countryTitleMin
                ? `Название меньше ${CONSTS.countryTitleMin} символов`
                : `Название больше ${CONSTS.countryTitleMax} символов`
            )
            setTitleInputError(true)
            return
        }


        // Проверка длины тега
        if (formTag.length > CONSTS.countryTagMax) {
            setErrorText(`Тег больше ${CONSTS.countryTagMax} символов`)
            setTagInputError(true)
            return
        }

        // Проверка наличия запрещенных символов
        const regex = /^[A-Za-z0-9_-]+$/; // Допускаем пробелы, подчеркивания и тире
        if (!regex.test(formTag)) {
            setErrorText(`Тег содержит запрещенные символы`)
            setTagInputError(true)
            return
        }

        // Если тег пустой - ставим по умолчанию
        if (!formTag) formTag = Context.userData.country_id ? Context.userData.country_id : "c" + Context.userData.id

        // Проверка длины фото
        if (formPhoto.length > CONSTS.photoMax) {
            setErrorText(`Ссылка на картинку больше ${CONSTS.photoMax} символов`)
            setPhotoInputError(true)
            return
        }

        // Если фото пустое - загружаем стандартное
        if (!countryPhotoPreview) {
            formPhoto = basePhotoSrc
        }


        // Проверка длины описания
        if (formBio.length > CONSTS.countryBioMax) {
            setErrorText(`Описание больше ${CONSTS.countryBioMax} символов`)
            setBioInputError(true)
            return
        }

        
        // Отключаем кнопку только в случае если прошло все проверки
        setDisableSubmitButton(true)
        setPageLoading()

        // Обновленные данные о стране
        let newCountryData = {
            country_id: "c" + Context.userData.id, // Уникальный id страны
            country_tag: "@" + formTag, // Тег для упрощенного поиска
            country_title: formTitle, // Отображаемое название страны
            country_bio: formBio, // Описание страны
            country_photo: formPhoto, // Флаг страны
        }

        sendData()

        console.log({token: Context.userData.token, data: JSON.stringify(newCountryData)});
        


        function sendData() {
            // Всю главную информацию отправляем всегда
            GSAPI("POSTcountryUpdate", {token: Context.userData.token, data: JSON.stringify(newCountryData)}, (data) => {
                console.log("GSAPI: POSTcountryUpdate");
                console.log(data);
    
                // Если тег не уникальный
                if (!data.success || !Object.keys(data).length) {
                    setErrorText("Введенный тег занят")
                    setTagInputError(true)
                    setDisableSubmitButton(false)
                    setPageLoading(false)
                    return
                }

                // Сохранение информации локально
                let newUserData = {...Context.userData}
                newUserData.country_id = newCountryData.country_id
                newUserData.country_tag = newCountryData.country_tag
                newUserData.country_title = newCountryData.country_title
                newUserData.country_bio = formBio
                newUserData.country_photo = newCountryData.country_photo

                localStorage.userData = JSON.stringify(newUserData)
                Context.setUserData(newUserData)

                // Удаляем старого юзера и загружаем нового
                let usersWithoutUser = Context.users.filter((user) => {return user.id !== Context.userData.id})
                usersWithoutUser.push(newUserData)
                Context.setUsers(usersWithoutUser)

                setPageLoading(false)
                Navigate("/country/" + newCountryData.country_id)
            })
        }
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
                        value={Context.userData.country_id ? Context.userData.country_id : "c" + Context.userData.id}
                        readOnly
                        required
                    />
                </CustomInput>

                <CustomInput label="Название страны" error={titleInputError}>
                    <input
                        ref={countryTitleInput}
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

                <CustomInput label="Тег страны" error={tagInputError} src={imgAt}>
                    <input
                        ref={countryTagInput}
                        type="text"
                        id="form-tag"
                        maxLength={CONSTS.countryTagMax}
                        onInput={handleInputUpdate}
                        onBlur={() => {
                            // Если строка пустая - ставим id страны
                            if (countryTagInput.current.value === "") {
                                countryTagInput.current.value = Context.userData.country_id ? Context.userData.country_id : "c" + Context.userData.id
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

                <CustomInput label="Ссылка на флаг страны" error={photoInputError}>
                    <input
                        ref={countryPhotoInput}
                        type="text"
                        id="form-photo"
                        maxLength={CONSTS.photoMax}
                        onInput={() => {
                            checkImageSource(countryPhotoInput.current.value) // Проверяем картинку
                            handleInputUpdate() // Так же обновляем все поля
                        }}
                        required
                    />
                </CustomInput>

                <small className="text-gray">
                    • Длина до {CONSTS.photoMax} символов
                    <br/>• Размер картинки от {CONSTS.photoPxMin}px/{CONSTS.photoPxMin}px до {CONSTS.photoPxMax}px/{CONSTS.photoPxMax}px
                    <br/>• Замена на стандартную картинку если поле пустое
                </small>
                {countryPhotoPreview &&
                    <img src={countryPhotoPreview} alt="preview" draggable="false" />
                }
                
                <CustomInput label={`Описание страны (${countryBioLength} / ${CONSTS.countryBioMax})`}
                    error={bioInputError}
                >
                    <textarea
                        ref={countryBioInput}
                        id="form-bio"
                        maxLength={CONSTS.countryBioMax}
                        onInput={() => {
                            setCountryBioLength(countryBioInput.current.value.length) // Обновляем значение длины описания
                            handleInputUpdate() // Так же обновляем все поля
                        }}
                        required 
                    ></textarea>
                </CustomInput>
                <small className="text-gray">
                    • Длина до {CONSTS.countryBioMax} символов
                </small>
                
                {errorText &&
                    <p className="text-red">{errorText}</p>
                }

                <button onClick={submitForm} disabled={disableSubmitButton} className="green">Сохранить</button>
            </section>
        </article>
    )
}
