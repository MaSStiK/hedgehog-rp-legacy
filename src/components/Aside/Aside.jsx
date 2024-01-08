import { useState, useContext } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom";
import { DataContext } from "../Context"
import ButtonIcon from "../ButtonIcon/ButtonIcon"
import imgLogo from "../../assets/logo/logo-fullsize.png"
import imgBurger from "../../assets/icons/Burger.svg"
import imgClose from "../../assets/icons/Close.svg"
import ButtonProfile from "../ButtonProfile/ButtonProfile"

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
            <ButtonIcon 
                id="nav-logo-phone"
                src={imgLogo}
                alt="logotype"
                onClick={() => {Navigate("/")}}
            />

            {/* Кнопка профиля в мобильной навигации */}
            {Context.userData && // Если есть юзердата - рендерим мобильную кнопку профиля
                <ButtonProfile
                    id="nav-phone-user"
                    type="tp"
                    src={Context.userData.photo}
                    onClick={() => {Navigate("/users/" + Context.userData.id)}} 
                />
            }

            {/* Кнопка открытия мобильного меню навигации */}
            <ButtonIcon 
                id="nav-menu-show"
                src={imgBurger}
                alt="open-menu"
                onClick={handleShowNavMenu}
            />

            {/* Контейнер навигации */}
            <div className={`nav-wrapper ${hideNavMenu ? "hide-nav-menu" : null}`}>
                <nav>
                    {/* Закрытие мобильного меню */}
                    <ButtonIcon 
                        id="nav-menu-hide"
                        src={imgClose}
                        alt="close-menu"
                        onClick={handleShowNavMenu}
                    />

                    <div id="nav-logo">
                        <img src={imgLogo} alt="nav-logo" onClick={() => {Navigate("/")}} />
                    </div>
                    
                    <ul>
                        <li>
                            {Context.userData // Если есть юзердата - рендерим кнопку профиля
                                ? <ButtonProfile
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
                                    ? <ButtonProfile
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

                        <div className="divider"></div>

                        <li><NavLink to={"/"}>Главная</NavLink></li>
                        <li><NavLink to={"/news"}>Новости</NavLink></li>
                        <li><NavLink to={"/users"}>Участники</NavLink></li>
                        <li><NavLink to={"/countries"}>Страны</NavLink></li>
                        <li><NavLink to={"/nations"}>Нации</NavLink></li>

                        <div className={"divider"}></div>

                        <li><NavLink to={"/tools"}>Инструменты</NavLink></li>
                        <li><NavLink to={"/support"}>Помощь</NavLink></li>
                        <li><NavLink to={"/about"}>О нас</NavLink></li>

                        {Context.isAdmin &&
                            <>
                                <div className="divider"></div>
                                <li><NavLink to={"/dev"}>dev</NavLink></li>
                            </>
                        }
                    </ul>
                </nav>
            </div>
        </aside> 
    )
}
