import { useRef, useEffect, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import { GSAPI } from "../GS-API"
import { VKAPI } from "../VK-API"
import { CONSTS, setPageLoading } from "../Global"
import imgLogo from "../../assets/logo/logo-fullsize.png"
import imgCopy from "../../assets/icons/Copy.svg"
import { LINKAPI } from "../LINK-API"


import "./PageLogin.css"
import "./PageLogin-phone.css"


export default function PageLogin() {
    const NavigateTo = useNavigate()
    const Context = useContext(DataContext)

    useEffect(() => {
        document.title = "Вход | Ежиное-РП"
    }, [])

    // Уникальный ключ
    function generateVkCode() {
        return Date.now().toString(32) + Math.random().toString(32).substring(2)
    }

    const [showCopyMessage, setshowCopyMessage] = useState(false) // Спрятать ли сообщение об скопированом коде

    const [vkCode, setvkCode] = useState(generateVkCode()) // Создаем ключ для отправки в вк

    const handleCopyButton = () => {
        navigator.clipboard.writeText(vkCode)
        setshowCopyMessage(true)
        setTimeout(() => setshowCopyMessage(false), 5000)
    }

    const [errorVkFindText, seterrorVkFindText] = useState("") // Отображать ли ошибку поиска юзера
    const [errorTokenText, seterrorTokenText] = useState("") // Текст ошибки при входе через токен
    const [codeInputError, setcodeInputError] = useState(false)  // Отображать ли ошибку инпута токена
    const [disableSubmitButton, setdisableSubmitButton] = useState(true) // Отключить ли кнопку входа по коду

    const tokenInput = useRef()

    // При обновлении любого из инпутов
    const handleInputUpdate = () => {
        seterrorTokenText("")
        seterrorVkFindText()

        setcodeInputError(false)
        setdisableSubmitButton(!tokenInput.current.value.length) // Если меньше 1 символа в поле токена
    }

    // Поиск кода
    function searchMessage() {
        // Отключаем кнопку только в случае если прошло все проверки
        setdisableSubmitButton(true)
        setPageLoading()

        seterrorVkFindText("")

        // Получаем все диалоги
        VKAPI("messages.getConversations", {}, (data) => {
            data = data.response

            // Перебираем все последние сообщения в чате
            let vkFindedUserId = data.items.find(message => message.last_message.text === vkCode)

            // Если не нашел
            if (!vkFindedUserId) {
                seterrorVkFindText("Сообщение не найдено!")
                setdisableSubmitButton(false)
                setPageLoading(false)
                return
            }

            vkFindedUserId = vkFindedUserId.last_message.from_id

            let newToken = Date.now().toString(32) + Math.random().toString(32).substring(2) + Math.random().toString(32).substring(2)

            GSAPI("authorizeById", {vk_id: vkFindedUserId.toString(), token: newToken}, (data) => {
                // Если не нашло - регаем нового юзера
                if (!data.success || !Object.keys(data).length) {
                    registrateNewUser(vkFindedUserId, newToken)
                    return
                }

                // Если успех - сохраняем и открываем главную
                let newUserData = data.data
                newUserData.token = newToken // Ставим токен
                localStorage.userData = JSON.stringify(newUserData)

                Context.setuserData(newUserData)
                Context.setisAdmin(newUserData.id === "291195777")

                // Отправляем сообщение пользователю
                let VKAPImessage = `Вы успешно вошли!\nТокен авторизации для входа в аккаунт на других устройствах:\n${newToken}`
                VKAPI("messages.send", {peer_id: vkFindedUserId, random_id: 0, message: VKAPImessage}, () => {
                    NavigateTo("/home")
                    setdisableSubmitButton(false)
                    setPageLoading(false)
                })
            })
        })
    }
    

    function registrateNewUser(user_id, newToken) {
        // // Находим информацию о пользователе
        VKAPI("users.get", {user_id: user_id, fields: "photo_200"}, (data) => {
            console.log("VKAPI: users.get");

            let vkData = data.response[0]

            // Таймштамп
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
                newUserData.photo = data

                // Отправляем данные о новом пользователе
                sendNewUser(newUserData, vkData, newToken)
            })
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
                setdisableSubmitButton(false)
                setPageLoading(false)
                return
            }

            // Отправляем сообщение в беседу логов
            let VKAPImessage = `Регистрация пользователя:\nname: ${newUserData.name}\nid: ${newUserData.id}\nlink: https://vk.com/id${newUserData.id}`
            VKAPI("messages.send", {peer_id: 2000000007, random_id: 0, message: VKAPImessage}, () => {

                // Отправляем сообщение пользователю
                VKAPImessage = `Вы успешно зарегистрировались!\nТокен авторизации для входа в аккаунт на других устройствах:\n${newToken}`
                VKAPI("messages.send", {peer_id: vkData.id, random_id: 0, message: VKAPImessage}, () => {
                    setPageLoading(false)

                    // Если успех - сохраняем и открываем главную
                    localStorage.userData = JSON.stringify(newUserData)
                    Context.setuserData(newUserData)
                    // Тут не проверяем на админа, ибо новый админ не создается
                    NavigateTo("/home")
                })
            })
        })
    }


    // Вход по токену
    function loginByToken() {
        handleInputUpdate() // Сброс всех ошибок

        let loginToken = tokenInput.current.value

        // Проверка длины кода
        if (loginToken.length > CONSTS.loginTokenMax) {
            seterrorTokenText(`Код больше ${CONSTS.loginTokenMax} символов`)
            setcodeInputError(true)
            return
        }

        // Отключаем кнопку только в случае если прошло все проверки
        setdisableSubmitButton(true)
        setPageLoading()

        GSAPI("authorizeByToken", {token: loginToken}, (data) => {
            setPageLoading(false)

            // Если не нашло по токену
            if (!data.success || !Object.keys(data).length) {
                seterrorTokenText("Токен не действителен")
                setcodeInputError(true)
                setdisableSubmitButton(false)
                return
            }

            // Если успех - сохраняем и открываем главную
            let newUserData = data.data
            newUserData.token = loginToken // Ставим токен
            localStorage.userData = JSON.stringify(newUserData)

            Context.setuserData(newUserData)
            Context.setisAdmin(newUserData.id === "291195777")

            // Отправляем сообщение пользователю
            let VKAPImessage = `Вы успешно вошли в свой аккаунт по токену!`
            VKAPI("messages.send", {peer_id: parseInt(newUserData.vk_id), random_id: 0, message: VKAPImessage}, () => {
                NavigateTo("/home")
            })
        })
    }

    return (
        <article id="article-login">
            <div className="logo-wrapper">
                <img src={imgLogo} alt="logo" onClick={() => {NavigateTo("/home")}} />
            </div>

            <section>
                <h2>Вход в аккаунт</h2>

                <p>Для входа в аккаунт отправте код ниже <Link to={"https://vk.com/write-202912556"} target="_blank" className="text-link">нашему боту "Географ"</Link></p>
                <small className="text-gray">Вы автоматически зарегистрируетесь, если у вас еще нету аккаунта</small>
                <button className="tp login__code-button" onClick={handleCopyButton}>
                    <p>Код: {vkCode}</p>
                    <img src={imgCopy} alt="copy" />
                </button>

                {showCopyMessage &&
                    <p className="text-gray">Скопировано</p>
                }

                <p>Нажмите на кнопку "Отправил", после того как отправите код боту</p>
                <small className="text-gray">Не перезагружайте эту страницу во время отправки сообщения, иначе код обновиться!</small>

                {errorVkFindText &&
                    <p className="text-red">{errorVkFindText}</p>
                }
                
                <button onClick={searchMessage}>Отправил</button>
                
                <div className="divider"></div>

                <p>Или введите токен авторизации, который бот отправлял вам ранее <br />(Если вы уже зарегистрированы)</p>

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
                    <p className="text-red">{errorTokenText}</p>
                }

                <button onClick={loginByToken} disabled={disableSubmitButton}>Войти</button>
            </section>
        </article>
    )
}