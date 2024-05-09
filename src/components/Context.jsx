import { useState, createContext } from "react";

// Создание контекста приложения
export const DataContext = createContext({
    userData: {},
    setUserData: () => {},

    users: [],
    setUsers: () => {},

    posts: [],
    setPosts: () => {},

    modalData: {},
    setModalData: () => {},
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

    // Передаем в контекст массив всех загруженных постов
    const [ContextPosts, setContextPosts] = useState([]);
    Context.posts = ContextPosts
    Context.setPosts = setContextPosts

    // Передаем в контекст Модальное окно
    const [ModalData, setModalData] = useState({});
    Context.modalData = ModalData
    Context.setModalData = setModalData

    return Context
}