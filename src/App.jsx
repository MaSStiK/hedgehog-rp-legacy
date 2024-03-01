// Импорт основных библиотек
import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { DataContext } from "./components/Context"
import { GSAPI } from "./components/API";
import { setPageLoading } from "./components/Global";
import Modal from "./components/Modal/Modal"
import $ from "jquery"

// Импорт стилей
import "./styles/style.css";
import "./App.css";
import "./App-phone.css";

// Импорт страниц
import Login from "./components/PageLogin/PageLogin";

import Home from "./components/PageHome/PageHome";
import News from "./components/PageNews/PageNews";
import NewsPost from "./components/PageNewsPost/PageNewsPost";
import NewsAdd from "./components/PageNewsAdd/PageNewsAdd";
import User from "./components/PageUser/PageUser";
import Users from "./components/PageUsers/PageUsers";
import UserEdit from "./components/PageUserEdit/PageUserEdit";
import Country from "./components/PageCountry/PageCountry";
import Countries from "./components/PageCountries/PageCountries";
import CountryEdit from "./components/PageCountryEdit/PageCountryEdit";
import Nations from "./components/PageNations/PageNations";
import Tools from "./components/PageTools/PageTools";
import Support from "./components/PageSupport/PageSupport";
import SupportCreatorsOfCountries from "./components/PageSupport/PageSupport_CreatorsOfCountries";

import About from "./components/PageAbout/PageAbout";
import Settings from "./components/PageSettings/PageSettings";

import Dev from "./components/PageDev/PageDev";

import NotFound from "./components/PageNotFound/PageNotFound";


export default function App() {
    const NavigateTo = useNavigate()
    const Context = useContext(DataContext) // Помять приложения, устанавливаем при запуске приложения

    // Передаем в контекст userData и его сеттер
    let userData = localStorage.userData ? JSON.parse(localStorage.userData) : null
    const [ContextUserData, setContextUserData] = useState(userData);
    Context.userData = ContextUserData
    Context.setUserData = setContextUserData

    // Ставим в контекст isAdmin
    const [ContextIsAdmin, setContextIsAdmin] = useState(userData ? userData.id === "291195777" : false);
    Context.isAdmin = ContextIsAdmin
    Context.setIsAdmin = setContextIsAdmin

    // Передаем в контекст массив всех юзеров
    const [ContextUsers, setContextUsers] = useState([]);
    Context.users = ContextUsers
    Context.setUsers = setContextUsers

    // Передаем в контекст массив всех загруженных постов
    const [ContextPosts, setContextPosts] = useState([]);
    Context.posts = ContextPosts
    Context.setPosts = setContextPosts

    // Передаем в контекст Модальное окно
    const [ModalData, setModalData] = useState([]);
    Context.modalData = ModalData
    Context.setModalData = setModalData

    useEffect(() => {
        // Анимация загрузки страницы
        setPageLoading()
        try {
            // После загрузки приложения делаем проверку токена, если он изменился - требуем залогиниться заново
            if (Context.userData) {
                GSAPI("authorizeByToken", {token: Context.userData.token}, (data) => {
                    console.log("GSAPI: authorizeByToken");
                    setPageLoading(false)

                    // Если токен изменился
                    if (!data.success || !Object.keys(data).length) { 
                        delete localStorage.userData
                        delete Context.userData
                        NavigateTo("/login")
                        window.location.reload()
                        return
                    }

                    let newUserData = {...data.data}
                    newUserData.token = Context.userData.token
                    localStorage.userData = JSON.stringify(newUserData)
                    setContextUserData(newUserData)
                })
            }

            // Загрузка всех постов
            GSAPI("GETposts", {offset: 0}, (data) => {
                console.log("GSAPI: GETposts offset=0");

                // После получения всех постов обновляем список в контексте
                setContextPosts(data)
            })

            // Загрузка всех юзеров
            GSAPI("GETusers", {}, (data) => {
                console.log("GSAPI: GETusers");

                // После получения всех юзеров обновляем список в контексте
                setContextUsers(data)

                // Если нету userData - останавливаем загрузку
                if (!Context.userData) {
                    setPageLoading(false)
                }
            })
        } catch(error) {
            // Если вдруг произошла ошибка - останавливаем загрузку
            setPageLoading(false)

            // Если произошла какая то ошибка, то удаляем userData и требуем залогиниться заново
            delete localStorage.userData
            delete Context.userData
            alert(`Произошла непредвиденная ошибка:\n${error}`)
            NavigateTo("/login")
            return
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // Если установлен стиль для сайта
    useEffect(() => {
        // По умолчанию новый год
        if (localStorage.pageEffect === undefined) {
            localStorage.pageEffect = "newYear"
        }

        if (localStorage.pageEffect) {
            $("body").attr("effect", localStorage.pageEffect)
        }
    }, [])

    return (
        <>
            <Modal>
                {ModalData}
            </Modal>

            <DataContext.Provider value={Context}>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/home" element={<Home />} />

                    <Route exact path="/news" element={<News />} />
                    <Route path="/news/:id" element={<NewsPost />} />
                    <Route exact path="/news/add" element={
                        <ProtectedRoute isAllowed={Context.userData}>
                            <NewsAdd />
                        </ProtectedRoute>
                    }/>

                    <Route exact path="/users" element={<Users />} />
                    <Route path="/users/:id" element={<User />} />
                    <Route exact path="/users/edit" element={
                        <ProtectedRoute isAllowed={Context.userData}>
                            <UserEdit />
                        </ProtectedRoute>
                    }/>

                    <Route exact path="/countries" element={<Countries />} />
                    <Route path="/countries/:id" element={<Country />} />
                    <Route exact path="/countries/edit" element={
                        <ProtectedRoute isAllowed={Context.userData}>
                            <CountryEdit />
                        </ProtectedRoute>
                    }/>


                    <Route exact path="/nations" element={<Nations />} />

                    <Route exact path="/tools" element={<Tools />} />
                    <Route path="/tools/exit" element={<Tools doExit={true} />} />

                    <Route exact path="/support" element={<Support />} />
                    <Route path="/support/creators-of-countries" element={<SupportCreatorsOfCountries />} />

                    <Route path="/about" element={<About />} />
                    <Route path="/settings" element={<Settings />} />

                    <Route path="/dev" element={
                        <ProtectedRoute isAllowed={Context.isAdmin}>
                            <Dev />
                        </ProtectedRoute>
                    }/>

                    <Route exact path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </DataContext.Provider>
        </>
    )
}