import { VKAPI } from "../API"

export default function MessagesGet(Context, vkConv, offset, disableFilter) {
    return new Promise((resolve, reject) => {
        // Получаем список сообщений от лица мотя бота
        VKAPI("messages.getHistory", {peer_id: vkConv, count: 200, offset: offset, rev: 0, extended: 1}, (data) => {
            let messages = data.response.items
            
            // Если фильтр не отключен
            if (!disableFilter) {
                messages = messages.filter(message => message.from_id === Number(Context.UserData.id) && message.text) // Фильтруем сообщения только от авторизованного  
            }  else {
                messages = messages.filter(message => message.text)
            }
            resolve({messages: messages, profiles: data.response.profiles})
            
        }, process.env.REACT_APP_VK_TOKEN_USERBOT)
    })
}
