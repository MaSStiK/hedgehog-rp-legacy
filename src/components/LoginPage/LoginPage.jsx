import { useRef, useEffect, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import ButtonImage from "../ButtonImage/ButtonImage"
import { GSAPI, VKAPI } from "../API"
import { CONSTS, setPageTitle, setPageLoading } from "../Global"
import imgLogo from "../../assets/logo/logoFullSize.png"
import imgCopy from "../../assets/icons/Copy.svg"
import imgLogin from "../../assets/icons/Login.svg"
import imgLinkout from "../../assets/icons/Linkout.svg"



import "./LoginPage.css"
import "./LoginPage-phone.css"

export default function LoginPage() {
    useEffect(() => {setPageTitle("Вход")}, [])
    const NavigateTo = useNavigate()
    const Context = useContext(DataContext)

    // Уникальный ключ
    function generateVkCode() {
        return (Math.random().toString(32).substring(2) + Date.now().toString(32)).toUpperCase()
    }

    const [showCopyMessage, setShowCopyMessage] = useState(false) // Спрятать ли сообщение об скопированном коде

    const [vkCode] = useState(generateVkCode()) // Создаем ключ для отправки в вк (state что бы при обновлении страницы не обновлялся код)

    const [errorVkFindText, setErrorVkFindText] = useState("") // Отображать ли ошибку поиска юзера
    const [errorTokenText, seTerrorTokenText] = useState("") // Текст ошибки при входе через токен
    const [codeInputError, setCodeInputError] = useState(false)  // Отображать ли ошибку инпута токена
    const [disableCodeButton, setDisableCodeButton] = useState(false)  // Отключить ли кнопку входа по коду
    const [disableSubmitButton, setDisableSubmitButton] = useState(true) // Отключить ли кнопку входа по токену

    const tokenInput = useRef()

    // При обновлении инпута с токеном
    function handleInputUpdate() {
        seTerrorTokenText("")
        setErrorVkFindText()

        setCodeInputError(false)
        setDisableSubmitButton(!tokenInput.current.value.length) // Если меньше 1 символа в поле токена
    }

    // Поиск кода
    function searchMessage() {
        // Отключаем кнопку во время проверки
        setDisableCodeButton(true)
        setErrorVkFindText("")

        setPageLoading()


        // Получаем все диалоги
        VKAPI("messages.getConversations", {}, (data) => {
            data = data.response

            // Перебираем все последние сообщения в чате
            let vkFoundUserId = data.items.find(message => message.last_message.text === vkCode)

            // Если не нашел
            if (!vkFoundUserId) {
                setErrorVkFindText("Сообщение не найдено!")
                setDisableCodeButton(false)
                setPageLoading(false)
                return
            }

            vkFoundUserId = vkFoundUserId.last_message.from_id

            let newToken = (Math.random().toString(32).substring(2) + Date.now().toString(32) + Math.random().toString(32).substring(2)).toUpperCase()

            GSAPI("authorizeById", {vk_id: vkFoundUserId.toString(), token: newToken}, (data) => {
                // Если не нашло - регистрируем нового юзера
                if (!data.success || !Object.keys(data).length) {
                    registrateNewUser(vkFoundUserId, newToken)
                    return
                }

                // Если успех - сохраняем и открываем главную
                let newUserData = data.data
                newUserData.token = newToken // Ставим токен
                localStorage.userData = JSON.stringify(newUserData)

                Context.setUserData(newUserData)
                Context.setIsAdmin(newUserData.id === "291195777")

                // Отправляем сообщение пользователю
                let VKAPImessage = `Вы успешно вошли!\nТокен авторизации для входа в аккаунт на других устройствах`
                VKAPI("messages.send", {peer_id: vkFoundUserId, random_id: 0, message: VKAPImessage}, () => {
                    VKAPI("messages.send", {peer_id: vkFoundUserId, random_id: 0, message: newToken}, () => {
                        NavigateTo("/")
                        setDisableCodeButton(false)
                        setPageLoading(false)
                    })
                })
            })
        })
    }
    

    function registrateNewUser(user_id, newToken) {
        // // Находим информацию о пользователе
        VKAPI("users.get", {user_id: user_id, fields: "photo_200"}, (data) => {
            console.log("VKAPI: users.get");

            let vkData = data.response[0]

            // Дата создания
            let dateNow = Date.now()

            // Данные нового пользователя
            let newUserData = {
                id: vkData.id.toString(), // id на сайте, по стандарту id от вк, но в случае чего можно изменить вручную (К примеру для второго аккаунта)
                token: newToken, // Токен авторизации
                tag: "@" + vkData.id.toString(), // Тег для упрощенного поиска
                vk_id: vkData.id.toString(), // Чаще всего совпадает, но если надо сделать профиль для группы, то можно изменить вручную
                vk_link: "https://vk.com/id" + vkData.id, // Ссылка на профиль, для групп другая
                name: vkData.first_name + " " + vkData.last_name, // Отображаемое имя и фамилия
                bio: "", // Описание
                photo: vkData.photo_200, // Фото профиля
                in_vk: dateNow, // Дата появления в беседе - устанавливается администратором
                timestamp: dateNow, // Дата регистрации
                // favorite: JSON.stringify({
                //     users: [],
                //     countries: []
                // }), 
                favorite: {}, // Избранные
                country_id: "",
                country_tag: "",
                country_title: "",
                country_photo: "",
                country_bio_main: "",
                country_bio_more: "",
            }

            sendNewUser(newUserData, vkData, newToken)
        })
    }

    // Отправка нового юзера
    function sendNewUser(newUserData, vkData, newToken) {
        // Отправляем пользователя
        GSAPI("POSTuser", {data: JSON.stringify(newUserData)}, (data) => {
            console.log("GSAPI: POSTuser");

            // Если токен не уникальный
            if (!data.success || !Object.keys(data).length) {
                errorVkFindText("Произошла ошибка во время регистрации!")
                setDisableSubmitButton(false)
                setPageLoading(false)
                return
            }

            // Отправляем сообщение в беседу логов
            let VKAPImessage = `Регистрация пользователя:\nname: ${newUserData.name}\nid: ${newUserData.id}\nlink: https://vk.com/id${newUserData.id}`
            VKAPI("messages.send", {peer_id: 2000000007, random_id: 0, message: VKAPImessage}, () => {

                // Отправляем сообщение пользователю
                VKAPImessage = `Вы успешно зарегистрировались!\nТокен авторизации для входа в аккаунт на других устройствах`
                VKAPI("messages.send", {peer_id: vkData.id, random_id: 0, message: VKAPImessage}, () => {
                    VKAPI("messages.send", {peer_id: vkData.id, random_id: 0, message: newToken}, () => {
                        setPageLoading(false)

                        // Если успех - сохраняем и открываем главную
                        localStorage.userData = JSON.stringify(newUserData)
                        Context.setUserData(newUserData)
                        // Тут не проверяем на админа, ибо новый админ не создается
                        NavigateTo("/")
                    })
                })
            })
        })
    }


    // Вход по токену
    function loginByToken() {
        handleInputUpdate() // Сброс всех ошибок

        let loginToken = tokenInput.current.value

        // Если токен пустой
        if (!loginToken) {
            seTerrorTokenText(`Вы не ввели токен`)
            setCodeInputError(true)
            return
        }

        // Проверка длины токена
        if (loginToken.length > CONSTS.loginTokenMax) {
            seTerrorTokenText(`Код больше ${CONSTS.loginTokenMax} символов`)
            setCodeInputError(true)
            return
        }

        // Отключаем кнопку только в случае если прошло все проверки
        setDisableSubmitButton(true)
        setPageLoading()

        GSAPI("authorizeByToken", {token: loginToken}, (data) => {
            setPageLoading(false)

            // Если не нашло по токену
            if (!data.success || !Object.keys(data).length) {
                seTerrorTokenText("Токен не действителен")
                setCodeInputError(true)
                setDisableSubmitButton(false)
                return
            }

            // Если успех - сохраняем и открываем главную
            let newUserData = data.data
            newUserData.token = loginToken // Ставим токен
            localStorage.userData = JSON.stringify(newUserData)

            Context.setUserData(newUserData)
            Context.setIsAdmin(newUserData.id === "291195777")

            // Отправляем сообщение пользователю
            let VKAPImessage = `Вы успешно вошли в свой аккаунт по токену!`
            VKAPI("messages.send", {peer_id: parseInt(newUserData.vk_id), random_id: 0, message: VKAPImessage}, () => {
                NavigateTo("/")
            })
        })
    }

    return (
        <article id="article-login">
            <div className="logo-wrapper">
                <img src={imgLogo} alt="logotype" onClick={() => {NavigateTo("/")}} />
            </div>

            <section>
                <h1>Вход в аккаунт</h1>
                <p>Для входа или регистрации отправьте код ниже <Link to={"https://vk.com/write-202912556"} target="_blank" className="text-link">нашему боту «Географ»</Link></p>

                <ButtonImage
                    className="tp"
                    src={imgCopy}
                    alt="copy-code"
                    text={vkCode}
                    onClick={() => {
                        navigator.clipboard.writeText(vkCode)
                        setShowCopyMessage(true)
                        setErrorVkFindText("")
                        setTimeout(() => setShowCopyMessage(false), 2000)
                    }}
                />
                {showCopyMessage &&
                    <p className="text-gray" style={{textAlign: "center"}}>Скопировано</p>
                }

                <small className="text-gray">
                    • Вы автоматически зарегистрируетесь, если у вас еще нет аккаунта<br />
                    • Не перезагружайте эту страницу во время отправки сообщения, иначе код обновится
                </small>
                <p>После отправки кода нажмите на кнопку</p>

                {errorVkFindText &&
                    <p className="text-red" style={{textAlign: "center"}}>{errorVkFindText}</p>
                }
                <button onClick={searchMessage} disabled={disableCodeButton}>Отправил</button>
                
                <hr />

                <p>Или введите актуальный токен авторизации, который вам отправлял бот</p>
                <Link className="login__link-support" to={"/support/auth-token"}>
                    <small className="text-gray link-image">Что такое токен авторизации</small>
                </Link>

                <CustomInput label="Токен авторизации">
                    <input
                        ref={tokenInput}
                        type="text"
                        id="form-code"
                        className={codeInputError ? "error" : null}
                        maxLength={CONSTS.loginTokenMax}
                        onInput={handleInputUpdate}
                        required
                    />
                </CustomInput>
                {errorTokenText &&
                    <p className="text-red" style={{textAlign: "center"}}>{errorTokenText}</p>
                }

                <ButtonImage
                    src={imgLogin}
                    text="Войти"
                    onClick={loginByToken}
                    disabled={disableSubmitButton}
                />
            </section>
        </article>
    )
}