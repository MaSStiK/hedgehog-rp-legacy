import { GSAPI } from "../API";

export default function SettingsSave(Context, pageSettings) {
    // Новые данные о настройках
    let newUserData = {
        settings: pageSettings, // Новые настройки
    }

    // Отправляем настройки
    GSAPI("PUTuser", {token: Context.UserData.token, data: JSON.stringify(newUserData)}, (data) => {
        console.log("GSAPI: PUTuser");

        // Если ошибка
        if (!data.success || !Object.keys(data).length) return

        // Сохранение информации локально
        let UserData = {...Context.UserData}
        UserData.settings = newUserData.settings
        document.cookie = `UserData=${JSON.stringify(UserData)}; path=/; max-age=2592000; SameSite=Strict` // Сохраняем в куки

        Context.setUserData(UserData)

        // Удаляем старого юзера и сохраняем нового
        let users = Context.Users.filter(user => user.id !== Context.UserData.id)
        users.push(UserData)
        Context.setUsers(users)
    })
}
