import { useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import { setPageTitle } from "../Global"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgCopy from "../../assets/svg/Copy.svg"
import imgRosehip from "../../assets/images/tools/rosehip.png"
import imgSearch from "../../assets/svg/Search.svg"

import "./ToolsPage.css"

export default function ToolsPage({ doLogout }) {
    useEffect(() => {setPageTitle("Инструменты")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()
    
    function logoutProfile() {
        localStorage.clear()
        sessionStorage.clear() // Удаляем всю информацию
        Navigate("/")
        window.location.reload()
    }

    // Если переход с ссылки на выход из профиля
    useEffect(() => {
        if (doLogout) {
            logoutProfile()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href])

    return (
        <article>
            <h4 className="page-title">h/tools</h4>

            <section className="flex-col">
                <h1>Шиповник <small className="text-gray">(feat. Даня)</small></h1>
                <h4 className="text-light">Данный список представляет собой сведения о существах, представляющих угрозу существования Кулсториробоба и его жителям</h4>
                <ButtonImage
                    src={imgRosehip}
                    text="Список Шиповника"
                    title="Перейти к списку Шиповника"
                    onClick={() => Navigate("rosehip")}
                />
            </section>

            {/* Если пользователь авторизован */}
            {Context.UserData
                ? <>
                    <section className="flex-col">
                        <h1>Новость из сообщения в ВК</h1>
                        <h4 className="text-light">Создайте новость из своего сообщения в беседе Ежиного-РП прямо на сайте</h4>
                        {Context.UserData?.country_id
                            ? <ButtonImage
                                src={imgSearch}
                                alt="find"
                                text="Найти сообщение"
                                title="Перейти к поиску сообщений"
                                onClick={() => Navigate("message-news")}
                              />
                            : <p>Скачало вам нужно создать свою страну</p>
                        }
                    </section>
                    
                    <section className="flex-col">
                        <h3>Сброс сохраненных данных сайта</h3>
                        <p className="text-light">Если вы перейдёте по ссылке, все сохранённые данные сайта будут сброшены. Это иногда помогает исправить ошибки, возникающие при неправильной работе сайта.
                            <br />Ваши данные аккаунта останутся нетронутыми, но вам потребуется заново войти в свой аккаунт.
                        </p>
                        
                        <div className="flex-row flex-wrap">
                            <div>
                                <p>Ссылка на функцию</p>
                                <Link to="exit" className="text-link">{window.location.origin + "/tools/exit"}</Link>
                            </div>
                            <ButtonImage
                                src={imgCopy}
                                alt="copy"
                                text="Скопировать"
                                title="Скопировать ссылку"
                                onClick={() => navigator.clipboard.writeText(window.location.origin + "/tools/exit")}
                            />
                        </div>
                    </section>
                  </>
                : <section>
                    <h4>Авторизуйтесь, чтобы увидеть еще больше инструментов</h4>
                  </section>
            }
        </article>
    )
}
