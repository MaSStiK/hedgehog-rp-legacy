import { GSAPI } from "../API";

export default function SettingsSave(Context, pageSettings) {
    // Новые данные о настройках
    let newUserData = {
        settings: pageSettings, // Новые настройки
    }

    // Отправляем настройки
    GSAPI("PUTuser", {token: Context.AuthToken, data: JSON.stringify(newUserData)}, (data) => {
        console.log("GSAPI: PUTuser");

        // Если ошибка
        if (!data.success || !Object.keys(data).length) return

        // Сохранение информации локально
        let UserData = {...Context.UserData}
        UserData.settings = newUserData.settings
        localStorage.UserData = JSON.stringify(UserData) // В память браузера сохраняем строку
        Context.setUserData(UserData)

        // Удаляем старого юзера и сохраняем нового
        let users = Context.Users.filter(user => user.id !== Context.UserData.id)
        users.push(UserData)
        Context.setUsers(users)
    })
}
