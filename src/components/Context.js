import { useState, createContext } from "react";
import { getCookie } from "./Global";

// Создание контекста приложения
export const DataContext = createContext({})

export function DataProvider({ children }) {
    // Передаем в контекст userData и его сеттер
    let userData
    try {
        userData = localStorage.UserData ? JSON.parse(localStorage.UserData) : null
    } catch {
        delete localStorage.UserData
        userData = null
    }

    const [UserData, setUserData] = useState(userData);

    // Получаем токен авторизации
    const AuthToken = getCookie("auth_token") ? getCookie("auth_token") : null

    // Настройки сайта
    let pageSettings
    try {
        pageSettings = localStorage.PageSettings ? JSON.parse(localStorage.PageSettings) : {}
    } catch {
        delete localStorage.PageSettings
        pageSettings = {}
    }

    const [PageSettings, setPageSettings] = useState(pageSettings);

    const [Users, setUsers] = useState([]); // Массив всех юзеров
    const [Posts, setPosts] = useState([]); // Массив Общего списка загруженных постов
    const [CountryPosts, setCountryPosts] = useState({}); // Объект с постами каждой страны
    const [Modal, setModal] = useState({}); // Модальное окно
    const [PostsOffset, setPostsOffset] = useState(0); // Offset постов
    const [Calendar, setCalendar] = useState([]); // Календарь

    return (
        <DataContext.Provider value={{
            UserData, setUserData, AuthToken, PageSettings, setPageSettings,
            Users, setUsers, Posts, setPosts, CountryPosts, setCountryPosts,
            Modal, setModal, PostsOffset, setPostsOffset, Calendar, setCalendar

        }}>
            {children}
        </DataContext.Provider>
    );
}