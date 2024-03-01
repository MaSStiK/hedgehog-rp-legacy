import { createContext } from "react";

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

    modalData: undefined,
    setModalData: () => {},
})