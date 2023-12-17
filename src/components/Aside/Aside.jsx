import { useState, useContext } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom";
import { DataContext } from "../Context"
import imgLogo from "../../assets/logo/logo.png"
import imgBurger from "../../assets/icons/Burger.svg"
import imgClose from "../../assets/icons/Close.svg"
import CustomButton from "../CustomButton/CustomButton"

import "./Aside.css"
import "./Aside-phone.css"

export default function Aside() {
    const Navigate = useNavigate()
    const Context = useContext(DataContext)

    const [hideNavMenu, sethideNavMenu] = useState(true);

    const handleShowNavMenu = () => {
        sethideNavMenu(!hideNavMenu)
    }

    return (
        <aside>
            {/* Темный фон во время открытого меню навигации */}
           <div id="nav-menu-bg" className={hideNavMenu ? "hide-nav-menu" : null} onClick={handleShowNavMenu}></div>

            {/* Лого в мобильной навигации */}
            <button id="nav-logo-phone" className="button-icon" onClick={() => {Navigate("/")}} >
                <img src={imgLogo} alt="nav-logo-phone" />
            </button>

            {/* Кнопка профиля в мобильной навигации */}
            {Context.userData && // Если есть юзердата - рендерим мобильную кнопку профиля
                <CustomButton
                    id="nav-phone-user"
                    type="tp"
                    src={Context.userData.photo}
                    onClick={() => {Navigate("/users/" + Context.userData.id)}} 
                />
            }

            {/* Кнопка открытия мобильного меню навигации */}
            <button id="nav-menu-show" className="button-icon" onClick={handleShowNavMenu}>
                <img src={imgBurger} alt="open-menu" />
            </button>

            {/* Контейнер навигации */}
            <div className={`nav-wrapper ${hideNavMenu ? "hide-nav-menu" : null}`}>
                <nav>
                    {/* Закрытие мобильного меню */}
                    <button id="nav-menu-hide" className="button-icon" onClick={handleShowNavMenu}>
                        <img src={imgClose} alt="close-menu" />
                    </button>

                    <div id="nav-logo">
                        <img src={imgLogo} alt="nav-logo" onClick={() => {Navigate("/")}} />
                    </div>
                    
                    <ul>
                        <li>
                            {Context.userData // Если есть юзердата - рендерим кнопку профиля
                                ? <CustomButton
                                    src={Context.userData.photo}
                                    text={Context.userData.name}
                                    subText={Context.userData.tag}
                                    onClick={() => {Navigate("/users/" + Context.userData.id)}} 
                                    style={{marginBottom: "var(--block-gap)"}}
                                  />
                                : <Link to={"/login"}>
                                    <button className="green">Авторизация</button>
                                  </Link>
                            }
                        </li>
                        
                        {Context.userData && // Если есть юзердата - ренлерим кнопку страны
                            <li>
                                {Context.userData.country_id // Если страны нету - рендерим кнопку для создания страны
                                    ? <CustomButton
                                        src={Context.userData.country_photo}
                                        text={Context.userData.country_title}
                                        subText={Context.userData.country_tag}
                                        onClick={() => {Navigate("/countries/" + Context.userData.country_id)}} 
                                      />
                                    : <Link to={"/countries/edit"}>
                                        <button className="green">Моя страна</button>
                                      </Link>
                                }
                            </li>
                        }

                        <div className="nav-divider"></div>

                        <li><NavLink to={"/"}>Главная</NavLink></li>
                        <li><NavLink to={"/news"}>Новости</NavLink></li>
                        <li><NavLink to={"/users"}>Участники</NavLink></li>
                        <li><NavLink to={"/countries"}>Страны</NavLink></li>
                        <li><NavLink to={"/nations"}>Нации</NavLink></li>

                        <div className={"nav-divider"}></div>

                        <li><NavLink to={"/tools"}>Инструменты</NavLink></li>
                        <li><NavLink to={"/help"}>Помощь</NavLink></li>
                        <li><NavLink to={"/about"}>О нас</NavLink></li>

                        {Context.isAdmin &&
                            <>
                                <div className="nav-divider"></div>
                                <li><NavLink to={"/dev"}>dev</NavLink></li>
                            </>
                        }
                        
                    </ul>
                </nav>
            </div>
        </aside> 
    )
}
