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
import Login from "./components/LoginPage/LoginPage";
import Registration from "./components/RegistrationPage/RegistrationPage";

import Home from "./components/HomePage/HomePage";
import News from "./components/NewsPage/NewsPage";
import NewsAdd from "./components/NewsAddPage/NewsAddPage";
import User from "./components/UserPage/UserPage";
import Users from "./components/UsersPage/UsersPage";
import UserEdit from "./components/UserEditPage/UserEditPage";
import Country from "./components/CountryPage/CountryPage";
import Countries from "./components/CountriesPage/CountriesPage";
import CountryEdit from "./components/CountryEditPage/CountryEditPage";
import Tools from "./components/ToolsPage/ToolsPage";

import Dev from "./components/DevPage/DevPage";

import NotFound from "./components/NotFoundPage/NotFoundPage";



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

                    // Если все успешно
                    if (data.success) { 
                        let newUserData = {...data.data}
                        newUserData.token = Context.userData.token
                        localStorage.userData = JSON.stringify(newUserData)
                        setContextUserData(newUserData)
                        return
                    }

                    delete localStorage.userData
                    delete Context.userData
                    Navigate("/login")
                    window.location.reload()
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
                <Route path="/registration" element={<Registration />} />

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


                <Route path="/nations" element={<NotFound />} />

                <Route path="/tools" element={<Tools />} />
                <Route path="/tools/exit" element={<Tools doExit={true} />} />

                <Route path="/help" element={<NotFound />} />
                <Route path="/about" element={<NotFound />} />

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