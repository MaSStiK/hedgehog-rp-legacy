import { VKAPI } from "../API"

export default function MessagesGet(Context, offset) {
    return new Promise((resolve, reject) => {
        // Получаем список сообщений от лица мотя бота
        VKAPI("messages.getHistory", {peer_id: 2000000001, count: 200, offset: offset, rev: 0}, (data) => {
            data = data.response.items
            data = data.filter(message => message.from_id === Number(Context.userData.id) && message.text) // Фильтруем сообщения только от авторизованного

            if (!sessionStorage.findMEssageVkUser) { // Если данных о пользователе нету в памяти
                // Находим информацию о пользователе
                VKAPI("users.get", {user_id: Context.userData.id, fields: "photo_100"}, (data_user) => {
                    data_user = data_user.response[0]

                    // Сохраняем юзера
                    sessionStorage.findMEssageVkUser = JSON.stringify(data_user)
                    resolve({messages: data, user: data_user})
                })
            } else {
                // Возвращаем юзера из памяти
                let data_user = JSON.parse(sessionStorage.findMEssageVkUser)
                resolve({messages: data, user: data_user})
            }
            
        }, process.env.REACT_APP_VK_TOKEN_USERBOT)
    })
}
