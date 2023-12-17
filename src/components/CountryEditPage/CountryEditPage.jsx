import { useEffect, useContext, useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import Aside from "../Aside/Aside"
import { CONSTS, setPageLoading } from "../Global"
import { GSAPI } from "../GS-API"
import { LINKAPI } from "../LINK-API"


import "./CountryEditPage.css"

export default function CountryEditPage() {
    const Context = useContext(DataContext)
    const Navigate = useNavigate()

    const [countryBioMainLenght, setcountryBioMainLenght] = useState(0);
    const [countryBioMoreLenght, setcountryBioMoreLenght] = useState(0);
    const [countryPhotoPreview, setcountryPhotoPreview] = useState("")

    const [errorText, seterrorText] = useState("") // Текст ошибки
    const [titleInputError, settitleInputError] = useState(false) // Отображать ли ошибку инпута Названия страны
    const [tagInputError, settagInputError] = useState(false) // Отображать ли ошибку инпута Названия страны
    const [bioMainInputError, setbioMainInputError] = useState(false) // Отображать ли ошибку инпута Описания
    const [bioMoreInputError, setbioMoreInputError] = useState(false) // Отображать ли ошибку инпута Доп Описания
    const [photoInputError, setphotoInputError] = useState(false) // Отображать ли ошибку инпута Сслыка на фото
    const [disableSubmitButton, setdisableSubmitButton] = useState(true) // Отключить ли кнопку сохранения

    const basePhotoSrc = "https://is.gd/fzchSz" // Сокращенная ссылка на базовое фото

    const countryTitleInput = useRef()
    const countryTagInput = useRef()
    const countryPhotoInput = useRef()
    const countryBioMainInput = useRef()
    const countryBioMoreInput = useRef()

    useEffect(() => {
        document.title = `${Context.userData.country_id ? "Изменение" : "Создание"} страны | Ежиное-РП`
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        countryTitleInput.current.value = Context.userData.country_title
        countryTagInput.current.value = Context.userData.country_tag

        countryPhotoInput.current.value = Context.userData.country_photo
        checkImageSource(countryPhotoInput.current.value) // Обновляем превью картинки

        // countryBioMainInput.current.value = Context.userData.country_bio_main.replaceAll("<br>","\n")
        countryBioMainInput.current.value = Context.userData.country_bio_main
        setcountryBioMainLenght(countryBioMainInput.current.value.length) // Обновляем значение длины описания

        // countryBioMoreInput.current.value = Context.userData.country_bio_more.replaceAll("<br>","\n")
        countryBioMoreInput.current.value = Context.userData.country_bio_more
        setcountryBioMoreLenght(countryBioMoreInput.current.value.length) // Обновляем значение длины доп описания
        
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
                    seterrorText("Не удалось загрузить картинку")
                    setcountryPhotoPreview("")
                    setphotoInputError(true)
                    return
                }

                // Если размер подходит - ставим превью
                setcountryPhotoPreview(src)
            }

            img.onerror = () => {
                seterrorText("Не удалось загрузить картинку")
                setcountryPhotoPreview("")
                setphotoInputError(true)
            }
        } else {
            setcountryPhotoPreview("")
        }
    }


    // При обновлении любого из инпутов
    const handleInputUpdate = () => {
        seterrorText("")
        settitleInputError(false)
        settagInputError(false)
        setbioMainInputError(false)
        setbioMoreInputError(false)
        setphotoInputError(false)
        setdisableSubmitButton(countryTitleInput.current.value.length < CONSTS.countryTitleMin) // Если меньше 1 символа в названии страны
        
        countryTagInput.current.value = countryTagInput.current.value.replaceAll(" ", "_")
    }

    // Ивент субмит у формы создания/изменения страны
    function submitForm() {
        handleInputUpdate() // Сброс всех ошибок

        let formTitle = countryTitleInput.current.value
        let formTag = countryTagInput.current.value
        let formPhoto = countryPhotoInput.current.value
        let formBioMain = countryBioMainInput.current.value
        let formBioMore = countryBioMoreInput.current.value


        // Проверка длины Названия
        if (formTitle.length < CONSTS.countryTitleMin || formTitle.length > CONSTS.countryTitleMax) {
            seterrorText(formTitle.length < CONSTS.countryTitleMin
                ? `Название меньше ${CONSTS.countryTitleMin} символов`
                : `Название больше ${CONSTS.countryTitleMax} символов`
            )
            settitleInputError(true)
            return
        }


        // Проверка длины тега
        if (formTag.length > CONSTS.countryTagMax + 1) {
            seterrorText(`Тег больше ${CONSTS.countryTagMax} символов`)
            settagInputError(true)
            return
        }

        // Проверка наличия запрещенных символов
        try {
            btoa(formTag)
        } catch {
            seterrorText(`Тег содержит запрещенные символы`)
            settagInputError(true)
            return
        }

        // Если тег пустой - ставим по умолчанию
        if (!formTag) {
            formTag = "@c" + Context.userData.id
        }


        // Проверка длины фото
        if (formPhoto.length > CONSTS.photoMax) {
            seterrorText(`Ссылка на картинку больше ${CONSTS.photoMax} символов`)
            setphotoInputError(true)
            return
        }

        // Если фото пустое - загружаем стандартное
        if (!countryPhotoPreview) {
            formPhoto = basePhotoSrc
        }


        // Проверка длины описания
        if (formBioMain.length > CONSTS.countryBioMainMax) {
            seterrorText(`Описание больше ${CONSTS.countryBioMainMax} символов`)
            setbioMainInputError(true)
            return
        }


        // Проверка длины доп описания
        if (formBioMore.length > CONSTS.countryBioMoreMax) {
            seterrorText(`Доп. описание больше ${CONSTS.countryBioMoreMax} символов`)
            setbioMoreInputError(true)
            return
        }

        
        // Отключаем кнопку только в случае если прошло все проверки
        setdisableSubmitButton(true)
        setPageLoading()

        // Обновленные данные о стране
        let newCountryData = {
            country_id: "c" + Context.userData.id, // Уникальный id страны
            country_tag: formTag, // Тег для упрощенного поиска
            country_title: formTitle, // Отображаемое название страны
            country_bio_main: formBioMain, // Описание страны
            country_bio_more: formBioMore, // Доп описание страны
            country_photo: formPhoto, // Флаг страны
        }

        LINKAPI(formPhoto, (data) => {
            // Если получилось сократить ссылку - сохраняем ее
            if (data.shorturl) {
                newCountryData.country_photo = data.shorturl
            }

            // После чего начинаем отпарвк информации
            sendData(newCountryData)
        })


        function sendData() {
            let countryDataNoBio = {...newCountryData}
            delete countryDataNoBio.country_bio_main
            delete countryDataNoBio.country_bio_more

            // Всю главную информацию отправляем всегда
            GSAPI("PUTcountry", {token: Context.userData.token, data: JSON.stringify(countryDataNoBio)}, (data) => {
                console.log("GSAPI: PUTcountry");
    
                // Если тег не уникальный
                if (!data.success || !Object.keys(data).length) {
                    seterrorText("Введенный тег занят")
                    settagInputError(true)
                    setdisableSubmitButton(false)
                    setPageLoading(false)
                    return
                }

                sendCountryBioMain()
            })
        }

        function sendCountryBioMain() {
            // Если главное описание не меняелось - проверка доп описания
            if (newCountryData.country_bio_main === Context.userData.country_bio_main) {
                sendCountryBioMore()
                return
            }

            // Если доп описание поменялось - отправляем изменения
            GSAPI("PUTcountryBioMain", {token: Context.userData.token, country_bio_main: newCountryData.country_bio_main}, (data) => {
                console.log("GSAPI: PUTcountryBioMain");

                if (!data.success || !Object.keys(data).length) {
                    seterrorText("Не удалось сохранить описание")
                    setbioMainInputError(true)
                    setdisableSubmitButton(false)
                    setPageLoading(false)
                    return
                }

                // После отправки главного описания проверяем нужно ли отправить доп описание
                sendCountryBioMore()
                return
            })
        }

        function sendCountryBioMore() {
            // Если доп описание не меняелось - сохраняем информацию
            if (newCountryData.country_bio_more === Context.userData.country_bio_more) {
                saveCountryData()
                return
            }

            // Если доп описание поменялось - отправляем изменения
            GSAPI("PUTcountryBioMore", {token: Context.userData.token, country_bio_more: formBioMore}, (data) => {
                console.log("GSAPI: PUTcountryBioMore");

                if (!data.success || !Object.keys(data).length) {
                    seterrorText("Не удалось сохранить доп. описание")
                    setbioMoreInputError(true)
                    setdisableSubmitButton(false)
                    setPageLoading(false)
                    return
                }

                // После отправки доп описания сохраняем информацию
                saveCountryData()
            })
        }


        // Сохранение информации локально
        function saveCountryData() {
            let newUserData = {...Context.userData}
            newUserData.country_id = newCountryData.country_id
            newUserData.country_tag = newCountryData.country_tag
            newUserData.country_title = newCountryData.country_title
            newUserData.country_bio_main = formBioMain
            newUserData.country_bio_more = formBioMore
            newUserData.country_photo = newCountryData.country_photo

            localStorage.userData = JSON.stringify(newUserData)
            Context.setuserData(newUserData)

            // Удаляем старого юзера и загружаем нового
            let usersWithoutUser = Context.users.filter((user) => {return user.id !== Context.userData.id})
            usersWithoutUser.push(newUserData)
            Context.setusers(usersWithoutUser)

            setPageLoading(false)
            Navigate("/countries/" + newCountryData.country_id)
        }
    }

    return (
        <>
            <Aside />

            <article id="article-country-edit">
                {/* Добавить изменение надписи на "Создание страны" если страна у юзера пустая */}
                <h4 className="page-title text-dark">{`/ ${Context.userData.country_id ? "Изменение" : "Создание"} страны`}</h4>

                <section className="section-country-edit">
                    <CustomInput label="ID Страны">
                        <input
                            type="text"
                            id="form-id"
                            value={Context.userData.country_id ? Context.userData.country_id : "c" + Context.userData.id}
                            readOnly
                            required
                        />
                    </CustomInput>

                    <CustomInput label="Название страны">
                        <input
                            ref={countryTitleInput}
                            type="text"
                            id="form-title"
                            className={titleInputError ? "error" : null}
                            maxLength={CONSTS.countryTitleMax}
                            onInput={handleInputUpdate}
                            required
                        />
                    </CustomInput>
                    <small>Длина названия от {CONSTS.countryTitleMin} до {CONSTS.countryTitleMax} символов</small>

                    <CustomInput label="Тег страны">
                        <input
                            ref={countryTagInput}
                            type="text"
                            id="form-tag"
                            className={tagInputError ? "error" : null}
                            maxLength={CONSTS.countryTagMax + 1}
                            onInput={handleInputUpdate}
                            onFocus={() => {
                                // Если при нажатии нету символов - добавляем @ в начало
                                if (!countryTagInput.current.value) {
                                    countryTagInput.current.value = "@"
                                }
                            }}
                            onBlur={() => {
                                // Если остался только символ @ - удаляем его
                                if (countryTagInput.current.value === "@") {
                                    countryTagInput.current.value = ""
                                }

                                // Если строка не пустая, но начинается не с @ - добавляем в начало и обрезаем строку
                                if (countryTagInput.current.value && !countryTagInput.current.value.startsWith("@")) {
                                    countryTagInput.current.value = "@" + countryTagInput.current.value.slice(0, CONSTS.countryTagMax)
                                }
                            }}
                            required
                        />
                    </CustomInput>
                    <small>Без пробелов<br/>Длина тега до {CONSTS.countryTagMax} символов<br />Только латиница, цифры и спецсимволы</small>

                    <CustomInput label="Ссылка на флаг страны">
                        <input
                            ref={countryPhotoInput}
                            type="text"
                            id="form-photo"
                            className={photoInputError ? "error" : null}
                            maxLength={CONSTS.photoMax}
                            onInput={() => {
                                checkImageSource(countryPhotoInput.current.value) // Проверяем картинку
                                handleInputUpdate() // Так же тригирим апдейт всех полей
                            }}
                            required
                        />
                    </CustomInput>

                    <small>Длина ссылки до {CONSTS.photoMax} символов<br />Размер картинки от {CONSTS.photoPxMin}px/{CONSTS.photoPxMin}px до {CONSTS.photoPxMax}px/{CONSTS.photoPxMax}px<br />Замена на стандартную картинку если поле пустое</small>
                    <img src={countryPhotoPreview} alt="preview" className={countryPhotoPreview ? null : "hidden"} />
                    
                    <CustomInput label={`Описание страны (${countryBioMainLenght} / ${CONSTS.countryBioMainMax})`}>
                        <textarea
                            ref={countryBioMainInput}
                            id="form-bio"
                            className={bioMainInputError ? "error" : null}
                            maxLength={CONSTS.countryBioMainMax}
                            onInput={() => {
                                setcountryBioMainLenght(countryBioMainInput.current.value.length) // Обновляем значение длины описания
                                handleInputUpdate() // Так же тригирим апдейт всех полей
                            }}
                            required 
                        ></textarea>
                    </CustomInput>
                    <small>Длина описания до {CONSTS.countryBioMainMax} символов</small>

                    <CustomInput label={`Доп. описание (${countryBioMoreLenght} / ${CONSTS.countryBioMoreMax})`}>
                        <textarea
                            ref={countryBioMoreInput}
                            id="form-bio"
                            className={bioMoreInputError ? "error" : null}
                            maxLength={CONSTS.countryBioMoreMax}
                            onInput={() => {
                                setcountryBioMoreLenght(countryBioMoreInput.current.value.length) // Обновляем значение длины доп описания
                                handleInputUpdate() // Так же тригирим апдейт всех полей
                            }}
                            required 
                        ></textarea>
                    </CustomInput>
                    <small>Доп. описание до {CONSTS.countryBioMoreMax} символов</small>

                    <p className={`text-red ${!errorText ? "hidden" : null}`}>{errorText}</p>

                    <button onClick={submitForm} disabled={disableSubmitButton} className="green">Сохранить</button>
                </section>
            </article>
        </>
    )
}
