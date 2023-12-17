import { createContext } from "react";

// Создание контекста приложения
export const DataContext = createContext({
    userData: {},
    setuserData: () => {},

    isAdmin: false,
    setisAdmin: () => {},

    users: [],
    setusers: () => {},

    posts: [],
    setposts: () => {},
});