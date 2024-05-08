import { GSAPI, VKAPI } from "../API"

export default function authViaCode(Context, vkCode) {
    return new Promise((resolve, reject) => {
        VKAPI("messages.getConversations", {}, (data) => {
            // Перебираем все последние сообщения в чате и находим кто отправил код 
            const foundUser = data.response.items.find(message => message.last_message.text === vkCode)

            // Если не нашло пользователя с таким кодом - показываем ошибку
            if (!foundUser) {
                return reject("Сообщение не найдено!")
            }
            resolve(foundUser.last_message.from_id)
        })
    })

    // После того как нашли сообщение с кодом возвращаем данные или регистрируем нового пользователя
    .then(vk_id => {
        return new Promise((resolve, reject) => {
            // Создаем новый длинный токен
            let newToken = (Math.random().toString(32).substring(2) + Date.now().toString(32) + Math.random().toString(32).substring(2)).toUpperCase()
            GSAPI("authViaCode", {vk_id: vk_id.toString(), token: newToken}, (data) => {
                // Если не нашло - регистрируем нового юзера
                if (!data.success || !Object.keys(data).length) {
                    registrateNewUser(vk_id, newToken)
                    .then(newUserData => {
                        // Если успех - сохраняем данные
                        localStorage.userData = JSON.stringify(newUserData)
                        Context.setUserData(newUserData)
                        resolve()
                    })
                    // Если произошла ошибка - передаем ее выше
                    .catch(error => reject(error))
                    return
                }
    
                // Если успех - сохраняем информацию
                let userData = data.data
                userData.token = newToken // Устанавливаем токен т.к. не передаем его
                localStorage.userData = JSON.stringify(userData)
        
                Context.setUserData(userData)
                Context.setIsAdmin(userData.id === "291195777")
    
                // Отправляем сообщение пользователю
                VKAPI("messages.send", {peer_id: vk_id, random_id: 0, message: `Вы успешно вошли!\nТокен авторизации для входа в аккаунт на других устройствах`},
                    () => VKAPI("messages.send", {peer_id: vk_id, random_id: 0, message: newToken}) // После основного сообщения посылаем токен
                )
                resolve()
            })
        })
    })
}

function registrateNewUser(user_id, newToken) {
    return new Promise((resolve, reject) => {
        // Находим информацию о пользователе
        VKAPI("users.get", {user_id: user_id, fields: "photo_200"}, (data) => {
            console.log("VKAPI: users.get");
    
            let vkData = data.response[0]
    
            // Дата создания
            let dateNow = Date.now()
    
            // Данные нового пользователя
            let newUserData = {
                id: vkData.id.toString(), // id на сайте, по стандарту id от вк, но в случае чего можно изменить вручную (К примеру для второго аккаунта)
                token: newToken, // Токен авторизации
                tag: "@" + vkData.id.toString(), // Тег для упрощенного поиска
                vk_id: vkData.id.toString(), // Чаще всего совпадает, но если надо сделать профиль для группы, то можно изменить вручную
                vk_link: "https://vk.com/id" + vkData.id, // Ссылка на профиль, для групп другая
                name: vkData.first_name + " " + vkData.last_name, // Отображаемое имя и фамилия
                bio: "", // Описание
                photo: vkData.photo_200, // Фото профиля
                in_vk: dateNow, // Дата появления в беседе - устанавливается администратором
                timestamp: dateNow, // Дата регистрации
                // favorite: JSON.stringify({
                //     users: [],
                //     countries: []
                // }), 
                favorite: {}, // Избранные
                country_id: "",
                country_tag: "",
                country_title: "",
                country_photo: "",
                country_bio: "",
            }

            // Отправляем пользователя
            GSAPI("POSTuser", {data: JSON.stringify(newUserData)}, (data) => {
                console.log("GSAPI: POSTuser");

                // Если токен не уникальный
                if (!data.success || !Object.keys(data).length) {
                    return reject("Произошла непредвиденная ошибка во время регистрации!")
                }

                // Отправляем сообщение в логи
                VKAPI("messages.send", {peer_id: 2000000007, random_id: 0, message: `Регистрация пользователя:\n${newUserData.name}\nhttps://vk.com/id${newUserData.id}`})
                // Отправляем сообщение пользователю
                VKAPI("messages.send", {peer_id: vkData.id, random_id: 0, message: `Вы успешно зарегистрировались!\nТокен авторизации для входа в аккаунт на других устройствах`},
                    () => VKAPI("messages.send", {peer_id: vkData.id, random_id: 0, message: newToken}) // После основного сообщения посылаем токен
                )
                resolve(newUserData)
            })
        })
    })
}
