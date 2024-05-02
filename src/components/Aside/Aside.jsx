import { useState, useEffect, useContext } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../Context"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgLogo from "../../assets/logo/logoFullSize.png"
import imgMenu from "../../assets/icons/Menu.svg"
import imgClose from "../../assets/icons/Close.svg"
import imgLogin from "../../assets/icons/Login.svg"
import imgAdd from "../../assets/icons/Add.svg"


// Иконки страниц
import imgHome from "../../assets/icons/Home.svg"
import imgNews from "../../assets/icons/News.svg"
import imgUser from "../../assets/icons/User.svg"
import imgCountry from "../../assets/icons/Country.svg"
import imgTool from "../../assets/icons/Tool.svg"
import imgHelp from "../../assets/icons/Help.svg"
import imgInfo from "../../assets/icons/Info.svg"
import imgSettings from "../../assets/icons/Settings.svg"
import imgUpdate from "../../assets/icons/Update.svg"
import imgDev from "../../assets/icons/Dev.svg"


import "./Aside.css"
import "./Aside-phone.css"

export default function Aside() {
    const Context = useContext(DataContext)
    const NavigateTo = useNavigate()
    const Location = useLocation()

    // Состояние открытого или закрытого меню навигации на телефоне
    const [showNavMenu, setShowNavMenu] = useState(false) // По умолчанию не показываем

    // При обновлении ссылки закрываем навигацию
    useEffect(() => {
        setShowNavMenu(false)
      }, [Location]);

    return (
        <aside>
            {/* Темный фон во время открытого меню навигации */}
            <div
                id="nav-menu-bg"
                className={showNavMenu ? "show-nav-menu" : ""}
                onClick={() => setShowNavMenu(false)}
            ></div>

            {/* Лого в мобильной навигации */}
            <ButtonImage
                id="nav-logo-phone"
                className="tp"
                src={imgLogo}
                alt="logotype"
                onClick={() => NavigateTo("/")}
            />

            {/* Кнопка страны в мобильной навигации */}
            {Context.userData && // Если есть userData - рендер мобильной кнопки профиля
                <ButtonProfile
                    id="nav-phone-country"
                    className="tp"
                    src={Context.userData.country_photo}
                    onClick={() => NavigateTo("/country/" + Context.userData.country_id)}
                />
            }

            {/* Кнопка профиля в мобильной навигации */}
            {Context.userData && // Если есть userData - рендер мобильной кнопки профиля
                <ButtonProfile
                    id="nav-phone-user"
                    className="tp"
                    src={Context.userData.photo}
                    onClick={() => NavigateTo("/user/" + Context.userData.id)}
                />
            }

            {/* Кнопка открытия мобильного меню навигации */}
            <ButtonImage
                id="nav-menu-open"
                className="tp"
                src={imgMenu}
                alt="open-menu"
                onClick={() => setShowNavMenu(true)}
            />

            {/* Контейнер навигации */}
            <div className={`nav-wrapper ${showNavMenu ? "show-nav-menu" : ""}`}>
                <nav>
                    {/* Закрытие мобильного меню */}
                    <ButtonImage
                        id="nav-menu-close"
                        className="tp"
                        src={imgClose}
                        alt="close-menu"
                        onClick={() => setShowNavMenu(false)}
                    />

                    <div id="nav-logo">
                        <NavLink to={"/"}>
                            <img src={imgLogo} alt="logotype" />
                        </NavLink>
                    </div>
                    
                    <ul>
                        <li>
                            {Context.userData // Если есть userData - рендер кнопку профиля, иначе кнопку Авторизации
                                ? <ButtonProfile
                                    src={Context.userData.photo}
                                    text={Context.userData.name}
                                    subText={Context.userData.tag}
                                    onClick={() => NavigateTo("/user/" + Context.userData.id)}
                                    style={{marginBottom: "var(--gap-small)"}}
                                  />
                                : <ButtonImage
                                    src={imgLogin}
                                    text="Авторизация"
                                    className="green"
                                    width100
                                    onClick={() => NavigateTo("/login")}
                                  />
                            }
                        </li>
                        
                        {Context.userData && // Если есть userData - рендер кнопки страны
                            <li>
                                {Context.userData.country_id // Если страны нету - рендер кнопки для создания страны
                                    ? <ButtonProfile
                                        src={Context.userData.country_photo}
                                        text={Context.userData.country_title}
                                        subText={Context.userData.country_tag}
                                        onClick={() => NavigateTo("/country/" + Context.userData.country_id)}
                                      />
                                    : <ButtonImage
                                        src={imgAdd}
                                        text={"Создать страну"}
                                        className="green"
                                        width100
                                        onClick={() => NavigateTo("/country/edit")}

                                    />
                                }
                            </li>
                        }

                        <hr />
                        <li>
                            <NavLink to={"/"}>
                                <img src={imgHome} alt="nav-icon" draggable="false" />
                                <p>Главная</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/news"}>
                                <img src={imgNews} alt="nav-icon" draggable="false" />
                                <p>Новости</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/user"}>
                                <img src={imgUser} alt="nav-icon" draggable="false" />
                                <p>Участники</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/country"}>
                                <img src={imgCountry} alt="nav-icon" draggable="false" />
                                <p>Страны</p>
                            </NavLink>
                        </li>
                        {/* <li><NavLink to={"/nation"}>Нации</NavLink></li> */}
                        <hr />
                        <li>
                            <NavLink to={"/tools"}>
                                <img src={imgTool} alt="nav-icon" draggable="false" />
                                <p>Инструменты</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/support"}>
                                <img src={imgHelp} alt="nav-icon" draggable="false" />
                                <p>Помощь</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/about"}>
                                <img src={imgInfo} alt="nav-icon" draggable="false" />
                                <p>О нас</p>
                            </NavLink>
                        </li>
                        <hr />
                        <li>
                            <NavLink to={"/settings"}>
                                <img src={imgSettings} alt="nav-icon" draggable="false" />
                                <p>Настройки</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/changelogs"}>
                                <img src={imgUpdate} alt="nav-icon" draggable="false" />
                                <p>Обновления</p>
                            </NavLink>
                        </li>
                        {Context.isAdmin && 
                            <li>
                                <NavLink to={"/dev"}>
                                    <img src={imgDev} alt="nav-icon" draggable="false" />
                                    <p>dev</p>
                                </NavLink>
                            </li>
                        }
                    </ul>
                </nav>
            </div>
        </aside> 
    )
}
