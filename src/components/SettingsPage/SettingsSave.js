import { GSAPI } from "../API";

export default function SettingsSave(Context, pageSettings) {
    // Новые данные о настройках
    let newUserData = {
        settings: pageSettings, // Новые настройки
    }

    // Всю главную информацию отправляем всегда
    GSAPI("PUTuser", {token: Context.UserData.token, data: JSON.stringify(newUserData)}, (data) => {
        console.log("GSAPI: PUTuser");

        // Если ошибка
        if (!data.success || !Object.keys(data).length) return

        // Сохранение информации локально
        let userData = {...Context.UserData}
        userData.settings = newUserData.pageSettings
        localStorage.UserData = JSON.stringify(userData) // В память браузера сохраняем строку
        Context.setUserData(userData)

        // Удаляем старого юзера и сохраняем нового
        let users = Context.Users.filter(user => user.id !== Context.UserData.id)
        users.push(userData)
        Context.setUsers(users)
    })
}
