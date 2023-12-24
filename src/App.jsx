// Импорт основных библиотек
import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { DataContext } from "./components/Context"
import { GSAPI } from "./components/GS-API";
import { setPageLoading } from "./components/Global";

// Импорт стилей
import "./styles/style.css";
import "./App.css";
import "./App-phone.css";

// Импорт страниц
import Login from "./components/PageLogin/PageLogin";

import Home from "./components/PageHome/PageHome";
import News from "./components/PageNews/PageNews";
import NewsAdd from "./components/PageNewsAdd/PageNewsAdd";
import User from "./components/PageUser/PageUser";
import Users from "./components/PageUsers/PageUsers";
import UserEdit from "./components/PageUserEdit/PageUserEdit";
import Country from "./components/PageCountry/PageCountry";
import Countries from "./components/PageCountries/PageCountries";
import CountryEdit from "./components/PageCountryEdit/PageCountryEdit";
import Nations from "./components/PageNations/PageNations";
import Tools from "./components/PageTools/PageTools";
import Help from "./components/PageHelp/PageHelp";
import About from "./components/PageAbout/PageAbout";


import Dev from "./components/PageDev/PageDev";

import NotFound from "./components/PageNotFound/PageNotFound";



export default function App() {
    const Navigate = useNavigate()
    const Context = useContext(DataContext) // Помять приложения, устанавливаем при запуске приложения

    // Передаем в контекст юзердату и его сеттер
    let userData = localStorage.userData ? JSON.parse(localStorage.userData) : null
    const [ContextUserData, setContextUserData] = useState(userData);
    Context.userData = ContextUserData
    Context.setuserData = setContextUserData

    // Ставим в контекст isAdmin
    const [ContextIsAdmin, setContextIsAdmin] = useState(userData ? userData.id === "291195777" : false);
    Context.isAdmin = ContextIsAdmin
    Context.setisAdmin = setContextIsAdmin

    // Передаем в контекст массив всех юзеров
    const [ContextUsers, setContextUsers] = useState([]);
    Context.users = ContextUsers
    Context.setusers = setContextUsers

    // Передаем в контекст массив всех юзеров
    const [ContextPosts, setContextPosts] = useState([]);
    Context.posts = ContextPosts
    Context.setposts = setContextPosts

    useEffect(() => {
        // Анимация загрузки страницы
        setPageLoading()
        try {
            // После загрузки приложения делаем проверку токена, если он изменился - требуем залогинится заного
            if (Context.userData) {
                GSAPI("authorize", {token: Context.userData.token}, (data) => {
                    console.log("GSAPI: authorize");
                    setPageLoading(false)

                    // Если токен изменился
                    if (!data.success || !Object.keys(data).length) { 
                        delete localStorage.userData
                        delete Context.userData
                        Navigate("/login")
                        window.location.reload()
                        return
                    }

                    let newUserData = {...data.data}
                    newUserData.token = Context.userData.token
                    localStorage.userData = JSON.stringify(newUserData)
                    setContextUserData(newUserData)
                })
            }

            // Загрузка всех новостей
            GSAPI("GETnews", {offset: 0}, (data) => {
                console.log("GSAPI: GETnews offset=0");

                // После получения всех новостей обновляем список в контексте
                setContextPosts(data)
            })

            // Загрузка всех юзеров
            GSAPI("GETusers", {}, (data) => {
                console.log("GSAPI: GETusers");

                // После получения всех юзеров обновляем список в контексте
                setContextUsers(data)

                // Если нету юзердаты - останавливаем загрузку
                if (!Context.userData) {
                    setPageLoading(false)
                }
            })
        } catch(error) {
            // Если вдруг произошла ошибка - останавливаем загрузку
            setPageLoading(false)

            // Если произошла какая то ошибка, то удаляем юзердату и требуем залогинится заного
            delete localStorage.userData
            delete Context.userData
            alert(`Произошла непредвиденная ошибка:\n${error}`)
            Navigate("/login")
            return
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <DataContext.Provider value={Context}>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/home" element={<Home />} />

                <Route path="/news" element={<News />} />
                <Route path="/news/add" element={
                    <ProtectedRoute isAllowed={Context.userData}>
                        <NewsAdd />
                    </ProtectedRoute>
                }/>

                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<User />} />
                <Route path="/users/edit" element={
                    <ProtectedRoute isAllowed={Context.userData}>
                        <UserEdit />
                    </ProtectedRoute>
                }/>

                <Route path="/countries" element={<Countries />} />
                <Route path="/countries/:id" element={<Country />} />
                <Route path="/countries/edit" element={
                    <ProtectedRoute isAllowed={Context.userData}>
                        <CountryEdit />
                    </ProtectedRoute>
                }/>


                <Route path="/nations" element={<Nations />} />

                <Route path="/tools" element={<Tools />} />
                <Route path="/tools/exit" element={<Tools doExit={true} />} />

                <Route path="/help" element={<Help />} />
                <Route path="/about" element={<About />} />

                <Route path="/dev" element={
                    <ProtectedRoute isAllowed={Context.isAdmin}>
                        <Dev />
                    </ProtectedRoute>
                }/>

                <Route exact path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </DataContext.Provider>
    )
}