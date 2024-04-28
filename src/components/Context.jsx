import { useState, createContext } from "react";

// Создание контекста приложения
export const DataContext = createContext({
    userData: {},
    setUserData: () => {},

    isAdmin: false,
    setIsAdmin: () => {},

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
    const [ModalData, setModalData] = useState({});
    Context.modalData = ModalData
    Context.setModalData = setModalData

    return Context
}