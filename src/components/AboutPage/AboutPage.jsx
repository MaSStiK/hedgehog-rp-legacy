import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { setPageTitle } from "../Global"
import { VKAPI } from "../API"
import imgBasePhoto from "../../assets/replace/photo-empty.png"


import "./AboutPage.css"

export default function AboutPage() {
    useEffect(() => {setPageTitle("О нас")}, [])
    const [groupDataVk, setGroupDataVk] = useState([]);
    const [userDataVk, setUserDataVk] = useState([]);

    useEffect(() => {
        // Если юзер в кэше
        if (sessionStorage.vkUsersAboutPage) {
            setUserDataVk(JSON.parse(sessionStorage.vkUsersAboutPage))
            return
        }

        // Находим информацию о важный персонаж сайта
        VKAPI("users.get", {user_ids: "291195777, 396771911, 307642230", fields: "photo_100"}, (data) => {
            if (data.response.length) {
                data = data.response

                // Сохраняем юзера
                sessionStorage.vkUsersAboutPage = JSON.stringify(data)
                setUserDataVk(data)
            }
        })
    }, [])

    useEffect(() => {
        // Если группа в кэше
        if (sessionStorage.vkGroupAboutPage) {
            setGroupDataVk(JSON.parse(sessionStorage.vkGroupAboutPage))
            return
        }

        // Находим информацию о группе
        VKAPI("groups.getById", {group_id: "196009619", fields: "photo_100"}, (data) => {
            if (data.response.length) {
                data = data.response

                // Сохраняем группу
                sessionStorage.vkGroupAboutPage = JSON.stringify(data)
                setGroupDataVk(data)
            }
        })
    }, [])


    return (
        <article>
            <h4 className="page-title">h/about</h4>

            <section className="flex-col">
                <h1>«Ежиное РП»</h1>
                <p>Это группа единомышленников и друзей, которые объединились, чтобы писать историю собственного мира.
                    <br/>Это творческая команда, которая занимается одновременно
                    <br/>- Историей
                    <br/>- Литературой
                    <br/>- Искусством
                    <br/>- Картографией
                </p>
            </section>

            <section className="flex-col">
                <h3>Наша группа в вк</h3>
                <ButtonProfile
                    src={groupDataVk.length ? groupDataVk[0].photo_100 : imgBasePhoto}
                    text={groupDataVk.length ? groupDataVk[0].name : "Загрузка"}
                    onClick={() => window.open("https://vk.com/public196009619", "_blank")}
                />
            </section>

            <section className="flex-col">
                <h3>По техническим вопросам сайта</h3>
                <ButtonProfile
                    src={userDataVk.length ? userDataVk[0].photo_100 : imgBasePhoto}
                    text={userDataVk.length ? `${userDataVk[0].first_name} ${userDataVk[0].last_name}` : "Загрузка"}
                    onClick={() => window.open("https://vk.com/id291195777", "_blank")}
                />
                <Link className="about__link-support" to={"/support/feedback"}>
                    <small className="text-gray link-image">Где оставить обратную связь (идеи/баги)</small>
                </Link>
            </section>

            <section className="flex-col">
                <h3>По вопросам группы и беседы в вк</h3>
                <ButtonProfile
                    src={userDataVk.length ? userDataVk[1].photo_100 : imgBasePhoto}
                    text={userDataVk.length ? `${userDataVk[1].first_name} ${userDataVk[1].last_name}` : "Загрузка"}
                    onClick={() => window.open("https://vk.com/id396771911", "_blank")}
                />
            </section>

            <section className="flex-col">
                <h3>Администратор беседы</h3>
                <ButtonProfile
                    src={userDataVk.length ? userDataVk[2].photo_100 : imgBasePhoto}
                    text={userDataVk.length ? `${userDataVk[2].first_name} ${userDataVk[2].last_name}` : "Загрузка"}
                    onClick={() => window.open("https://vk.com/id307642230", "_blank")}
                />
            </section>
        </article>
    )
}
