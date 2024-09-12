import { useState, createContext } from "react";

// Создание контекста приложения
export const DataContext = createContext({})

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace("/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1'") + "=([^;]*)" //eslint-disable-line
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Устанавливаем стейты в приложении
export function CreateContext(Context) {
    // Передаем в контекст userData и его сеттер
    let userData
    try {
        userData = getCookie("UserData") ? JSON.parse(getCookie("UserData")) : null
    } catch {
        userData = null
    }

    const [ContextUserData, setContextUserData] = useState(userData);
    Context.UserData = ContextUserData
    Context.setUserData = setContextUserData


    // Настройки сайта
    let PageSettings
    try {
        PageSettings = localStorage.PageSettings ? JSON.parse(localStorage.PageSettings) : {}
    } catch {
        delete localStorage.PageSettings
        PageSettings = {}
    }

    const [ContextPageSettings, setContextPageSettings] = useState(PageSettings);
    Context.PageSettings = ContextPageSettings
    Context.setPageSettings = setContextPageSettings
    
    
    // Массив всех юзеров
    const [ContextUsers, setContextUsers] = useState([]);
    Context.Users = ContextUsers
    Context.setUsers = setContextUsers

    // Массив Общего списка загруженных постов
    const [ContextPosts, setContextPosts] = useState([]);
    Context.Posts = ContextPosts
    Context.setPosts = setContextPosts

    // Объект с постами каждой страны
    const [CountryPosts, setCountryPosts] = useState({});
    Context.CountryPosts = CountryPosts
    Context.setCountryPosts = setCountryPosts

    // Модальное окно
    const [Modal, setModal] = useState({});
    Context.Modal = Modal
    Context.setModal = setModal

    // Offset постов
    const [PostsOffset, setPostsOffset] = useState(0);
    Context.PostsOffset = PostsOffset
    Context.setPostsOffset = setPostsOffset

    return Context
}