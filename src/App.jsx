// Импорт основных библиотек
import { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { DataContext, CreateContext } from "./components/Context"
import { GSAPI } from "./components/API";
import { CONFIG, setPageLoading } from "./components/Global";
import Modal from "./components/Modal/Modal"
import { CountryPostsSave } from "./components/CountryPage/CountryPostsLoad"
import $ from "jquery"

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
import RosehipPage from "./components/RosehipPage/RosehipPage";
import ToolsMessagesFindPage from "./components/ToolsMessagesFindPage/ToolsMessagesFindPage";

import Support from "./components/SupportPage/SupportPage";
import SupportCreatorsList from "./components/SupportPage/SupportPage_CreatorsList";
import SupportAuthToken from "./components/SupportPage/SupportPage_AuthToken";
import SupportFeedback from "./components/SupportPage/SupportPage_Feedback";

import About from "./components/AboutPage/AboutPage";
import Settings from "./components/SettingsPage/SettingsPage";
import Changelogs from "./components/ChangelogsPage/ChangelogsPage";
import Dev from "./components/DevPage/DevPage";

import NotFound from "./components/NotFoundPage/NotFoundPage";


export default function App() {
    // Своя функция "CreateContext" которая вписывает useState в контекст
    const Context = CreateContext(useContext(DataContext)) // Помять приложения, устанавливаем при запуске

    useEffect(() => {
        setPageLoading() // Анимация загрузки страницы

        // После загрузки приложения делаем проверку токена, если он изменился - требуем залогиниться заново
        if (Context.userData) {
            new Promise((resolve, reject) => {
                // Если есть userData, но нету токена - критическая ошибка
                if (!Context.userData.token) return reject()

                GSAPI("AuthViaToken", {token: Context.userData.token}, (data) => {
                    console.log("GSAPI: AuthViaToken");

                    // Если токен изменился
                    if (!data.success || !Object.keys(data).length) return reject()

                    // Если авторизация успешная - сохраняем данные
                    resolve(data.data)
                })
            })
            .then(newUserData => {
                newUserData.token = Context.userData.token // Устанавливаем токен т.к. его не передаем
                localStorage.userData = JSON.stringify(newUserData) // Сохраняем в память браузера
                Context.setUserData(newUserData) // Сохраняем в память приложения
            })
            .catch(() => { // Отчищаем данные
                // delete localStorage.userData
                delete localStorage.clear() // Удаляем всю информацию
                delete Context.userData
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Если установлен стиль для сайта
    useEffect(() => {
        if (localStorage.pageTheme === undefined) { // Если в памяти нету темы - по умолчанию никакой
            localStorage.pageTheme = "default"
        }
        
        if (localStorage.pageTheme) {// Устанавливаем тему
            $("body").attr("theme", localStorage.pageTheme)
        }
    }, [])

    return (
        <>
            <Modal>
                {Context.modalData}
            </Modal>

            <Aside />

            <DataContext.Provider value={Context}>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/home" element={<Home />} />

                    <Route path="/news" element={<News />} />
                    <Route path="/news/:id" element={<NewsPost />} />
                    <Route path="/news/add" element={
                        <ProtectedRoute
                            isAllowed={Context.userData && Context.userData.country_id}
                            to="/news"
                            element={<NewsAdd />} 
                        />
                    }/>
                    <Route path="/news/edit" element={
                        <ProtectedRoute
                            isAllowed={Context.userData && Context.userData.country_id}
                            to="/news"
                            element={<NewsEdit />} 
                        />
                    }/>

                    <Route path="/user" element={<UserList />} />
                    <Route path="/user/:id" element={<User />} />
                    <Route path="/user/edit" element={
                        <ProtectedRoute
                            isAllowed={Context.userData}
                            to="/user"
                            element={<UserEdit />} 
                        />
                    }/>

                    <Route path="/country" element={<CountryList />} />
                    <Route path="/country/:id" element={<Country />} />
                    <Route path="/country/edit" element={
                        <ProtectedRoute
                            isAllowed={Context.userData}
                            to="/country"
                            element={<CountryEdit />} 
                        />
                    }/>

                    <Route path="/nation" element={<Nation />} />

                    <Route path="/tools" element={<Tools />} />
                    <Route path="/tools/exit" element={<Tools doLogout={true} />} />
                    <Route path="/tools/rosehip" element={<RosehipPage />} />
                    <Route path="/tools/find-message" element={
                        <ProtectedRoute
                            isAllowed={Context.userData && Context.userData.country_id}
                            to="/tools"
                            element={<ToolsMessagesFindPage />} 
                        />
                    }/>

                    <Route path="/support" element={<Support />} />
                    <Route path="/support/feedback" element={<SupportFeedback />} />
                    <Route path="/support/auth-token" element={<SupportAuthToken />} />
                    <Route path="/support/creators-list" element={<SupportCreatorsList />} />
                    
                    <Route path="/about" element={<About />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/changelogs" element={<Changelogs />} />

                    <Route path="/dev" element={
                        <ProtectedRoute
                            isAllowed={Context.userData ? Context.userData.roles.includes("admin") : false}
                            element={<Dev />}
                        />
                    }/>

                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </DataContext.Provider>
        </>
    )
}