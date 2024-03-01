import { useState, useContext } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom";
import { DataContext } from "../Context"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgLogo from "../../assets/logo/logoFullSize.png"
import imgBurger from "../../assets/icons/Burger.svg"
import imgClose from "../../assets/icons/Close.svg"
import ButtonProfile from "../ButtonProfile/ButtonProfile"

import "./Aside.css"
import "./Aside-phone.css"

export default function Aside() {
    const NavigateTo = useNavigate()
    const Context = useContext(DataContext)

    const [hideNavMenu, setHideNavMenu] = useState(true);

    function handleShowNavMenu () {
        setHideNavMenu(!hideNavMenu)
    }

    return (
        <aside>
            {/* Темный фон во время открытого меню навигации */}
           <div id="nav-menu-bg" className={`phone-show ${hideNavMenu ? "hide-nav-menu" : null}`} onClick={handleShowNavMenu}></div>

            {/* Лого в мобильной навигации */}
            <ButtonImage 
                id="nav-logo-phone"
                className="phone-show tp"
                src={imgLogo}
                alt="logotype"
                onClick={() => {NavigateTo("/")}}
            />

            {/* Кнопка профиля в мобильной навигации */}
            {Context.userData && // Если есть userData - рендер мобильной кнопки профиля
                <ButtonProfile
                    id="nav-phone-user"
                    className="phone-show tp"
                    src={Context.userData.photo}
                    onClick={() => {NavigateTo("/users/" + Context.userData.id)}} 
                />
            }

            {/* Кнопка открытия мобильного меню навигации */}
            <ButtonImage 
                id="nav-menu-show"
                className="phone-show tp"
                src={imgBurger}
                alt="open-menu"
                onClick={handleShowNavMenu}
            />

            {/* Контейнер навигации */}
            <div className={`nav-wrapper ${hideNavMenu ? "hide-nav-menu" : null}`}>
                <nav>
                    {/* Закрытие мобильного меню */}
                    <ButtonImage 
                        id="nav-menu-hide"
                        className="phone-show tp"
                        src={imgClose}
                        alt="close-menu"
                        onClick={handleShowNavMenu}
                    />

                    <div id="nav-logo">
                        <img src={imgLogo} alt="logotype" onClick={() => {NavigateTo("/")}} />
                    </div>
                    
                    <ul>
                        <li>
                            {Context.userData // Если есть userData - рендер кнопку профиля
                                ? <ButtonProfile
                                    src={Context.userData.photo}
                                    text={Context.userData.name}
                                    subText={Context.userData.tag}
                                    onClick={() => {NavigateTo("/users/" + Context.userData.id)}} 
                                    style={{marginBottom: "var(--block-gap)"}}
                                  />
                                : <Link to={"/login"}>
                                    <button className="green">Авторизация</button>
                                  </Link>
                            }
                        </li>
                        
                        {Context.userData && // Если есть userData - рендер кнопки страны
                            <li>
                                {Context.userData.country_id // Если страны нету - рендер кнопки для создания страны
                                    ? <ButtonProfile
                                        src={Context.userData.country_photo}
                                        text={Context.userData.country_title}
                                        subText={Context.userData.country_tag}
                                        onClick={() => {NavigateTo("/countries/" + Context.userData.country_id)}} 
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
                        {/* <li><NavLink to={"/nations"}>Нации</NavLink></li> */}

                        <div className={"divider"}></div>

                        <li><NavLink to={"/tools"}>Инструменты</NavLink></li>
                        <li><NavLink to={"/support"}>Помощь</NavLink></li>
                        <li><NavLink to={"/about"}>О нас</NavLink></li>

                        <div className="divider"></div>
                        <li><NavLink to={"/settings"}>Настройки</NavLink></li>


                        {Context.isAdmin &&
                            <>
                                <li><NavLink to={"/dev"}>dev</NavLink></li>
                            </>
                        }
                    </ul>
                </nav>
            </div>
        </aside> 
    )
}
