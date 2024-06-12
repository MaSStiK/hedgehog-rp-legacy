import { useState, createContext } from "react";

// Создание контекста приложения
export const DataContext = createContext({
    userData: {},
    setUserData: () => {},

    users: [],
    setUsers: () => {},

    posts: [],
    setPosts: () => {},

    countryPosts: {},
    setCountryPosts: () => {},

    modalData: {},
    setModalData: () => {},

    postsOffset: 0,
    setPostsOffset: () => {},
})

// Устанавливаем стейты в приложении
export function CreateContext(Context) {
    // Передаем в контекст userData и его сеттер
    let userData
    try {
        userData = localStorage.userData ? JSON.parse(localStorage.userData) : null
    } catch {
        delete localStorage.userData
        userData = null
    }
    const [ContextUserData, setContextUserData] = useState(userData);
    Context.userData = ContextUserData
    Context.setUserData = setContextUserData
    
    // Передаем в контекст массив всех юзеров
    const [ContextUsers, setContextUsers] = useState([]);
    Context.users = ContextUsers
    Context.setUsers = setContextUsers

    // Передаем в контекст массив Общего списка загруженных постов
    const [ContextPosts, setContextPosts] = useState([]);
    Context.posts = ContextPosts
    Context.setPosts = setContextPosts

    // Передаем в контекст объект с постами каждой страны
    const [CountryPosts, setCountryPosts] = useState({});
    Context.countryPosts = CountryPosts
    Context.setCountryPosts = setCountryPosts

    // Передаем в контекст Модальное окно
    const [ModalData, setModalData] = useState({});
    Context.modalData = ModalData
    Context.setModalData = setModalData

    // Передаем в контекст offset постов
    const [PostsOffset, setPostsOffset] = useState(0);
    Context.postsOffset = PostsOffset
    Context.setPostsOffset = setPostsOffset

    return Context
}