import { GSAPI, VKAPI } from "../API"

export default function AuthViaCode(Context, vkCode) {
    return new Promise((resolve, reject) => {
        VKAPI("messages.getConversations", {extended: 1}, (data) => {
            // Перебираем все последние сообщения в чате и находим кто отправил код 
            const foundUser = data.response.items.find(msg => msg.last_message.text === vkCode)

            // Если не нашло пользователя с таким кодом - показываем ошибку
            if (!foundUser) return reject("Сообщение не найдено!")

            // Находим информацию о пользователе написавшем сообщение
            const foundUserData = data.response.profiles.find(user => user.id === foundUser.last_message.from_id)

            // Создаем новый длинный токен
            let newToken = (Math.random().toString(32).substring(2) + Date.now().toString(32) + Math.random().toString(32).substring(6)).toUpperCase()
            let dateNow = Date.now() // Дата создания аккаунта
    
            // Создаем массив со всей информацией о пользователе, он будет использован если будет регистрация
            let newUserData = {
                id: foundUserData.id.toString(), // id на сайте, по стандарту id от вк, но в случае чего можно изменить вручную (К примеру для второго аккаунта)
                token: newToken, // Токен авторизации
                tag: "@" + foundUserData.id.toString(), // Тег для упрощенного поиска
                vk_id: foundUserData.id.toString(), // Чаще всего совпадает, но если надо сделать профиль для группы, то можно изменить вручную
                vk_link: "https://vk.com/id" + foundUserData.id, // Ссылка на профиль, для групп другая
                name: foundUserData.first_name + " " + foundUserData.last_name, // Отображаемое имя и фамилия
                bio: "", // Описание
                photo: foundUserData.photo_100, // Фото профиля
                timestamp: dateNow, // Дата регистрации
                roles: "[]", // Роли
                settings: "{}", // Настройки
                favorite: "{}", // Избранные
                country_id: "",
                country_tag: "",
                country_name: "",
                country_photo: "",
                country_bio: "",
            }

            GSAPI("AuthViaCode", {vk_id: foundUserData.id.toString(), token: newToken, data: JSON.stringify(newUserData)}, (data) => {
                // Если ошибка
                if (!data.success || !Object.keys(data).length) return reject("Произошла ошибка во время регистрации")
    
                // Если успех - сохраняем информацию
                let userData = data.data
                userData.token = newToken // Устанавливаем токен т.к. не передаем его
                localStorage.userData = JSON.stringify(userData)
        
                Context.setUserData(userData)

                // Если обычный вход
                if (!data.registration) {
                    // Отправляем сообщение пользователю о входе
                    VKAPI("messages.send", {peer_id: foundUserData.id, random_id: 0, message: `Вы успешно вошли!\nТокен авторизации для входа в аккаунт на других устройствах`},
                        () => VKAPI("messages.send", {peer_id: foundUserData.id, random_id: 0, message: newToken}) // После основного сообщения посылаем токен
                    )
                } else { // Если регистрация
                    // Отправляем сообщение в логи
                    VKAPI("messages.send", {peer_id: 2000000007, random_id: 0, message: `Регистрация пользователя:\n${newUserData.name}\nhttps://vk.com/id${newUserData.id}`})
                    // Отправляем сообщение пользователю о регистрации
                    VKAPI("messages.send", {peer_id: foundUserData.id, random_id: 0, message: `Вы успешно зарегистрировались!\nТокен авторизации для входа в аккаунт на других устройствах`},
                        () => VKAPI("messages.send", {peer_id: foundUserData.id, random_id: 0, message: newToken}) // После основного сообщения посылаем токен
                    )
                }
                resolve()
            })
        })
    })
}