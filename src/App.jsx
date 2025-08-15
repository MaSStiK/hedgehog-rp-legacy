// Импорт основных библиотек
import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { DataContext } from "./components/Context"
import { GSAPI } from "./components/API";
import { CONFIG, setPageLoading } from "./components/Global";
import Modal from "./components/Modal/Modal"
import { CountryPostsSave } from "./components/CountryPage/CountryPostsLoad"
import SetTheme from "./components/SetTheme";
import Confetti from "./components/theme_party_confetti";

// Импорт стилей
import "./styles/style.css";
import "./App.css";
import "./App-phone.css";

// Импорт навигации
import Aside from "./components/Aside/Aside"

// Импорт страниц
import Login from "./components/LoginPage/LoginPage";
import Home from "./components/HomePage/HomePage";
import News from "./components/NewsPage/NewsPage";
import NewsPost from "./components/NewsPostPage/NewsPostPage";
import NewsAdd from "./components/NewsAddPage/NewsAddPage";
import NewsEdit from "./components/NewsEditPage/NewsEditPage";
import User from "./components/UserPage/UserPage";
import UserList from "./components/UserListPage/UserListPage";
import UserEdit from "./components/UserEditPage/UserEditPage";
import Country from "./components/CountryPage/CountryPage";
import CountryList from "./components/CountryListPage/CountryListPage";
import CountryEdit from "./components/CountryEditPage/CountryEditPage";
import Nation from "./components/NationPage/NationPage";

import Tools from "./components/ToolsPage/ToolsPage";
import ToolsMessagesNewsPage from "./components/ToolsMessagesNewsPage/ToolsMessagesNewsPage";
// import DicePage from "./components/DicePage/DicePage";
import RosehipPage from "./components/RosehipPage/RosehipPage";

import { SupportPage } from "./components/SupportPage/SupportPage";
import SupportArticle from "./components/SupportPage/SupportPage_Article";

import About from "./components/AboutPage/AboutPage";
import Settings from "./components/SettingsPage/SettingsPage";
import Changelogs from "./components/ChangelogsPage/ChangelogsPage";
import PolicyPage from "./components/PolicyPage/PolicyPage";
import Dev from "./components/DevPage/DevPage";
import DevElements from "./components/DevPage/DevElementsPage";

import NotFound from "./components/NotFoundPage/NotFoundPage";


export default function App() {
    const Context = useContext(DataContext) // Помять приложения, устанавливаем при запуске

    useEffect(() => {
        setPageLoading() // Анимация загрузки страницы

        // После загрузки приложения делаем проверку токена, если он изменился - требуем залогиниться заново
        if (Context.UserData) {
            new Promise((resolve, reject) => {
                // Если есть userData, но нету токена - критическая ошибка
                if (!Context.AuthToken) return reject()

                GSAPI("AuthViaToken", {token: Context.AuthToken}, (data) => {
                    console.log("GSAPI: AuthViaToken");

                    // Если токен изменился
                    if (!data.success || !Object.keys(data).length) return reject()

                    // Если авторизация успешная - сохраняем данные
                    resolve(data.data)
                })
            })
            .then(newUserData => {
                localStorage.UserData = JSON.stringify(newUserData) // Сохраняем в память браузера
                Context.setUserData(newUserData) // Сохраняем в память приложения

                localStorage.PageSettings = JSON.stringify(newUserData.settings) // Сохраняем настройки в память браузера
                Context.setPageSettings(newUserData.settings) // Сохраняем настройки
            })
            .catch(() => { // Отчищаем данные
                localStorage.clear() // Удаляем всю информацию
                sessionStorage.clear() // Удаляем всю информацию
                document.cookie = `auth_token=""; path=/; max-age=-1; SameSite=Strict` // Удаляем куки
                delete Context.UserData
                window.location.reload()
            })
        }

        // Загрузка всех юзеров
        function getUsers() {
            return new Promise((resolve, reject) => {
                GSAPI("GETusers", {}, (data) => {
                    console.log("GSAPI: GETusers");
                    Context.setUsers(data) // Сохраняем в память приложения
                    resolve()
                })
            })
        }

        // Загрузка всех постов
        function getPosts() {
            return new Promise((resolve, reject) => {
                let offset = 0
                GSAPI("GETposts", {offset: offset, amount: CONFIG.POSTS_AMOUNT}, (data) => {
                    console.log(`GSAPI: GETposts {offset: ${offset}, amount: ${CONFIG.POSTS_AMOUNT}}`);
                    Context.setPosts(data.posts) // После получения всех постов обновляем общий список в контексте
                    CountryPostsSave(Context, data.posts) // Сохраняем полученные данные в объект постов стран
                    resolve()
                })
            })
        }

        // Когда выполнятся обе загрузки - останавливаем анимацию загрузки страницы
        Promise.all([getUsers(), getPosts()])
        .then(() => {
            setPageLoading(false)
        })

        
        // Загрузка календаря
        GSAPI("GETcalendar", {}, (data) => {
            console.log("GSAPI: GETcalendar");
            Context.setCalendar(data) // Сохраняем в память приложения
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Если установлен стиль для сайта
    useEffect(() => {
        SetTheme(Context)
        Confetti(Context.PageSettings.theme === "party") // Инициализация конфетти
    }, [Context, Context.PageSettings])

    return (
        <>
            <Modal>
                {Context.Modal}
            </Modal>

            <Aside />

            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/home" element={<Home />} />

                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsPost />} />
                <Route path="/news/add" element={
                    <ProtectedRoute
                        isAllowed={Context.UserData?.country_id}
                        to="/news"
                        element={<NewsAdd />} 
                    />
                }/>
                <Route path="/news/edit" element={
                    <ProtectedRoute
                        isAllowed={Context.UserData?.country_id}
                        to="/news"
                        element={<NewsEdit />} 
                    />
                }/>

                <Route path="/user" element={<UserList />} />
                <Route path="/user/:id" element={<User />} />
                <Route path="/user/edit" element={
                    <ProtectedRoute
                        isAllowed={Context.UserData}
                        to="/user"
                        element={<UserEdit />} 
                    />
                }/>

                <Route path="/country" element={<CountryList />} />
                <Route path="/country/:id" element={<Country />} />
                <Route path="/country/edit" element={
                    <ProtectedRoute
                        isAllowed={Context.UserData}
                        to="/country"
                        element={<CountryEdit />} 
                    />
                }/>

                <Route path="/nation" element={<Nation />} />

                <Route path="/tools" element={<Tools />} />
                <Route path="/tools/exit" element={<Tools doLogout={true} />} />
                <Route path="/tools/rosehip" element={<RosehipPage />} />
                <Route path="/tools/message-news" element={
                    <ProtectedRoute
                        isAllowed={Context.UserData?.country_id}
                        to="/tools"
                        element={<ToolsMessagesNewsPage />} 
                    />
                }/>
                {/* <Route path="/tools/dice" element={
                    <ProtectedRoute
                        isAllowed={Context.UserData}
                        to="/tools"
                        element={<DicePage />} 
                    />
                }/> */}

                <Route path="/support" element={<SupportPage />} />
                <Route path="/support/:id" element={<SupportArticle />} />
                
                <Route path="/about" element={<About />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/changelogs" element={<Changelogs />} />
                <Route path="/policy" element={<PolicyPage />} />

                <Route path="/dev" element={
                    <ProtectedRoute
                        isAllowed={Context.UserData ? Context.UserData.roles.includes("admin") : false}
                        element={<Dev />}
                    />
                }/>

                <Route path="/dev/elements" element={
                    <ProtectedRoute
                        isAllowed={Context.UserData ? Context.UserData.roles.includes("admin") : false}
                        element={<DevElements />}
                    />
                }/>


                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}