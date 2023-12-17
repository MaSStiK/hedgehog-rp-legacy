import { useRef, useEffect, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import CustomButton from "../CustomButton/CustomButton"
import { GSAPI } from "../GS-API"
import { VKAPI } from "../VK-API"
import { CONSTS, setPageLoading } from "../Global"
import imgLogo from "../../assets/logo/logo.png"
import imgCopy from "../../assets/icons/Copy.svg"
import { LINKAPI } from "../LINK-API"


import "./RegistrationPage.css"
import "./RegistrationPage-phone.css"


export default function RegistrationPage() {
    const Navigate = useNavigate()
    const Context = useContext(DataContext)

    useEffect(() => {
        document.title = "Регистрация | Ежиное-РП"
    }, [])

    // Уникальный ключ
    function generateVkCode() {
        return Date.now().toString(32)
    }

    const [showPage, setshowPage] = useState(1) // Отображаемая страница
    const [showCopyMessage, setshowCopyMessage] = useState(false) // Спрятать ли сообщение об скопированом коде

    const [textVkFindUserError, settextVkFindUserError] = useState("") // Отображать ли ошибку поиска юзера
    const [vkCode, setvkCode] = useState(generateVkCode()) // Создаем ключ для отправки в вк
    const [vkData, setvkData] = useState({}) // Информация о юзере

    const handleCopyButton = () => {
        navigator.clipboard.writeText(vkCode)
        setshowCopyMessage(true)
        setTimeout(() => setshowCopyMessage(false), 5000)
    }


    // Начать поиск сообщений
    const firstPageSubmit = () => {
        setshowPage(2)
        setvkData({})
        settextVkFindUserError("")

        // Получаем все диалоги
        VKAPI("messages.getConversations", {}, (data) => {
            data = data.response

            let vkFindedUserId = null

            // Перебираем все последние сообщения в чате
            for (let message of data.items) {
                // Если находит сообщение с ключем, то записывает id юзера и заканчивает цикл
                if (message.last_message.text === vkCode) {
                    vkFindedUserId = message.last_message.from_id
                    break
                }
            }

            // Если не нашел
            if (!vkFindedUserId) {
                settextVkFindUserError("Сообщение не найдено!")
                return
            }
            
            // Находим информацию о пользователе
            VKAPI("users.get", {user_id: vkFindedUserId, fields: "photo_200"}, (data) => {
                data = data.response[0]

                setvkData({
                    id: vkFindedUserId,
                    name: data.first_name + " " + data.last_name,
                    photo: data.photo_200,
                })
            })
        })
    }

    // Вернутся на первую страницу
    const goFirstPage = () => {
        setvkCode(generateVkCode()) // Обновляем код
        setshowPage(1)
    }

    // Переход на последнюю страницу
    const middlePageSubmit = () => {
        setPageLoading()

        // Проверка уникальности найденого юзера
        GSAPI("POSTuserCheck", {id: vkData.id}, (data) => {
            setPageLoading(false)

            // Если такого id нету - переходим на последнюю страницу
            if (data.success) {
                setshowPage(3)
                return
            }

            // Если найден id, то ошибка
            setvkData({})
            settextVkFindUserError("Этот пользователь уже зарегистрирован!")
        })
    }

    const [errorText, seterrorText] = useState("") // Текст ошибки
    const [loginInputError, setloginInputError] = useState(false) // Отображать ли ошибку инпута логина
    const [passwordInputError, setpasswordInputError] = useState(false)  // Отображать ли ошибку инпута пароля
    const [passwordAgainInputError, setpasswordAgainInputError] = useState(false) // Отображать ли ошибку повтора пароля
    const [disableSubmitButton, setdisableSubmitButton] = useState(false) // Отключить ли кнопку входа

    const loginInput = useRef()
    const passwordInput = useRef()
    const passwordAgainInput = useRef()

    // При обновлении любого из инпутов
    const handleInputUpdate = () => {
        seterrorText("")
        setloginInputError(false)
        setpasswordInputError(false)
        setpasswordAgainInputError(false)

        loginInput.current.value = loginInput.current.value.replaceAll(" ", "_")
        passwordInput.current.value = passwordInput.current.value.replaceAll(" ", "_")
        passwordAgainInput.current.value = passwordAgainInput.current.value.replaceAll(" ", "_")
    }

    // Ивент субмит у формы регистрации
    function regForm(event) {
        // Отключение базового перехода
        event.preventDefault()

        handleInputUpdate() // Сброс всех ошибок

        let formLogin = loginInput.current.value
        let formPassword = passwordInput.current.value
        let formPasswordAgain = passwordAgainInput.current.value

        // Проверка длины логина
        if (formLogin.length < CONSTS.loginMin || formLogin.length > CONSTS.loginMax) {
            seterrorText(formLogin.length < CONSTS.loginMin
                ? `Логин меньше ${CONSTS.loginMin} символов`
                : `Логин больше ${CONSTS.loginMax} символов`
            )
            setloginInputError(true)
            return
        }

        // Проверка длины пароля
        if (formPassword.length < CONSTS.passwordMin || formPassword.length > CONSTS.passwordMax) {
            seterrorText(formPassword.length < CONSTS.passwordMin
                ? `Пароль меньше ${CONSTS.passwordMin} символов`
                : `Пароль больше ${CONSTS.passwordMax} символов`
            )
            setpasswordInputError(true)
            return
        }

        // Проверка совпадения пароля
        if (formPassword !== formPasswordAgain) {
            seterrorText("Пароли не совпадают")
            setpasswordInputError(true)
            setpasswordAgainInputError(true)
            return
        }

        // Проверка наличия запрещенных символов
        let token = null
        try {
            token = btoa(formLogin + " " + formPassword)
        } catch {
            seterrorText("Введены запрещенные символы")
            setloginInputError(true)
            setpasswordInputError(true)
            setpasswordAgainInputError(true)
            return
        }


        // Отключаем кнопку только в случае если прошло все проверки
        setdisableSubmitButton(true)
        setPageLoading()


        // Таймштамп
        let dateNow = Date.now()

        // Данные нового пользователя
        let newUserData = {
            id: vkData.id.toString(), // id на сайте, по стандарту id от вк, но в случае чего можно изменить вручную (К примеру для второго аккаунта)
            token: token, // Токен авторизации
            tag: "@" + vkData.id.toString(), // Тег для упрощенного поиска
            vk_id: vkData.id.toString(), // Чаще всего совпадает, но если надо сделать профиль для группы, то можно изменить вручную
            vk_link: "https://vk.com/id" + vkData.id, // Ссылка на профиль, для групп другая
            name: vkData.name, // Отображаемое имя и фамилия
            bio: "", // Описание
            photo: vkData.photo, // Фото профиля
            in_vk: dateNow, // Дата появления в беседе - устанавливается администратором
            timestamp: dateNow, // Дата регистрации
            // favourite: JSON.stringify({
            //     users: [],
            //     countries: []
            // }), 
            favourite: {}, // Избранные
            country_id: "",
            country_tag: "",
            country_title: "",
            country_photo: "",
            country_bio_main: "",
            country_bio_more: "",
        }

        LINKAPI(vkData.photo, (data) => {
            // Если получилось сократить ссылку - сохраняем ее
            if (data.shorturl) {
                newUserData.photo = data.shorturl
            }

            // Отправляем пользователя
            GSAPI("POSTuser", {data: JSON.stringify(newUserData), login: formLogin}, (data) => {
                console.log("GSAPI: POSTuser");

                // Если токен не уникальный
                if (!data.success || !Object.keys(data).length) {
                    seterrorText("Введенный логин занят")
                    setloginInputError(true)
                    setdisableSubmitButton(false)
                    setPageLoading(false)
                    return
                }
    
                // Отправляем сообщение в беседу логов
                let VKAPImessage = `Регистрация пользователя:\nname: ${vkData.name}\nid: ${vkData.id}\nlink: ${"https://vk.com/id" + vkData.id}`
                VKAPI("messages.send", {peer_id: 2000000007, random_id: 0, message: VKAPImessage}, () => {
    
                    // Отправляем сообщение пользователю
                    VKAPImessage = "Вы успешно зарегистрировались!"
                    VKAPI("messages.send", {peer_id: vkData.id, random_id: 0, message: VKAPImessage}, () => {
                        setPageLoading(false)
    
                        // Если успех - сохраняем и открываем главную
                        localStorage.userData = JSON.stringify(newUserData)
                        Context.setuserData(newUserData)
                        // Тут не проверяем на админа, ибо новый админ не создается
                        Navigate("/home")
                    })
                })
            })
        })
    }

    return (
        <article id="article-registration">
            <div className="section-reg__logo">
                <img src={imgLogo} alt="logo" onClick={() => {Navigate("/")}} />
            </div>

            <section id="section-reg">
                <div id="section-reg__page-first" className={showPage !== 1 ? "hidden" : null}>
                    <h2>Регистрация</h2>
                    <h3>1) Прикрепите свой профиль в ВК</h3>
                    <p>Отправте код ниже <Link to={"https://vk.com/write-202912556"} target="_blank" rel="noopener noreferrer" className="text-link">нашему боту "Географ"</Link></p>

                    <button className="tp section-reg__code-button" onClick={handleCopyButton}>
                        <p id="section-reg__code">Код: {vkCode}</p>
                        <img src={imgCopy} alt="copy" />
                    </button>

                    <p className={`text-gray ${!showCopyMessage ? "hidden" : null}`}>Скопировано</p>

                    <p>Нажмите на кнопку "Отправил", после того как отправите сообщение боту</p>

                    <button onClick={firstPageSubmit}>Отправил</button>
                </div>

                <div id="section-reg__page-middle" className={showPage !== 2 ? "hidden" : null}>
                    <h2>Регистрация</h2>
                    <h3>2) Проверка аккаунта</h3>

                    {/* Если найден юзер */}
                    {Object.keys(vkData).length !== 0 &&
                    <>
                        <p>Это вы?</p>
                        <Link to={`https://vk.com/id${vkData.id}`} target="_blank" rel="noopener noreferrer">
                            <CustomButton src={vkData.photo} text={vkData.name} />
                        </Link>
                        <button className="green" onClick={middlePageSubmit}>Да</button>
                        <button className="red" onClick={goFirstPage}>Нет</button>
                    </>
                    }

                    {/* Если ошибка */}
                    {textVkFindUserError &&
                        <>
                            <p className="text-red">{textVkFindUserError}</p>
                            <button onClick={goFirstPage}>Назад</button>
                        </>
                    }
                    
                </div>

                <form onSubmit={regForm} id="section-reg__page-last" className={showPage !== 3 ? "hidden" : null}>
                    <h2>Регистрация</h2>
                    <h3>3) Придумайте логин и пароль</h3>

                    <CustomInput label="Логин">
                        <input
                            ref={loginInput}
                            type="text"
                            id="form-login"
                            className={loginInputError ? "error" : null}
                            maxLength={CONSTS.loginMax}
                            onInput={handleInputUpdate}
                            required
                        />
                    </CustomInput>

                    <small>Без пробелов<br/>Длина логина от {CONSTS.loginMin} до {CONSTS.loginMax} символов<br/>Только латиница, цифры и спецсимволы</small>

                    <CustomInput label="Пароль" password={true}>
                        <input
                            ref={passwordInput}
                            type="password"
                            id="form-password"
                            className={passwordInputError ? "error" : null}
                            maxLength={CONSTS.passwordMax}
                            onInput={handleInputUpdate}
                            required
                        />
                    </CustomInput>

                    <small>Без пробелов<br/>Длина пароля от {CONSTS.passwordMin} до {CONSTS.passwordMax} символов<br/>Только латиница, цифры и спецсимволы</small>

                    <CustomInput label="Повторите пароль" password={true}>
                        <input
                            ref={passwordAgainInput}
                            type="password"
                            id="form-password-again"
                            className={passwordAgainInputError ? "error" : null}
                            maxLength={CONSTS.passwordMax}
                            onInput={handleInputUpdate}
                            required
                        />
                    </CustomInput>

                    <p className={`text-red ${!errorText ? "hidden" : null}`}>{errorText}</p>

                    <button className="green section-reg__button" type="submit" disabled={disableSubmitButton}>Зарегистрироваться</button>
                    <button type="button" onClick={() => {setshowPage(2)}}>Назад</button>
                </form>
            </section>

            <div className="section-reg__sub-text">
                <p><small className="text-gray">Уже есть аккаунт?</small></p>
                <Link to={"/login"} className="text-link small">Войди!</Link>
            </div>
        </article>
    )
}