import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { setPageTitle } from "../Global"
import { VKAPI } from "../API"
import AboutReviews from "./AboutReviews"
import imgBasePhoto from "../../assets/replace/photo-empty.png"

import "./AboutPage.css"
import "./AboutPage-phone.css"

export default function AboutPage() {
    useEffect(() => {setPageTitle("О нас")}, [])
    const [groupDataVk, setGroupDataVk] = useState([]);
    const [userDataVk, setUserDataVk] = useState([]);

    useEffect(() => {
        // Если юзер в кэше
        if (sessionStorage.aboutPageVkUsers) {
            setUserDataVk(JSON.parse(sessionStorage.aboutPageVkUsers))
            return
        }

        // Находим информацию о важный персонаж сайта
        VKAPI("users.get", {user_ids: "291195777, 396771911, 307642230", fields: "photo_100"}, (data) => {
            if (data.response.length) {
                data = data.response

                // Сохраняем юзера
                sessionStorage.aboutPageVkUsers = JSON.stringify(data)
                setUserDataVk(data)
            }
        })
    }, [])

    useEffect(() => {
        // Если группа в кэше
        if (sessionStorage.aboutPageVkGroup) {
            setGroupDataVk(JSON.parse(sessionStorage.aboutPageVkGroup))
            return
        }

        // Находим информацию о группе
        VKAPI("groups.getById", {group_id: "196009619", fields: "photo_100"}, (data) => {
            if (data.response.length) {
                data = data.response

                // Сохраняем группу
                sessionStorage.aboutPageVkGroup = JSON.stringify(data)
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
                    <br />Это творческая команда, которая занимается одновременно
                    <br />- Историей
                    <br />- Литературой
                    <br />- Искусством
                    <br />- Картографией
                </p>
            </section>

            <section className="flex-col">
                <h1>Наша группа в вк</h1>
                <ButtonProfile
                    src={groupDataVk[0]?.photo_100 || imgBasePhoto}
                    text={groupDataVk[0]?.name}
                    onClick={() => window.open("https://vk.com/public196009619", "_blank")}
                />
            </section>

            <section className="flex-col">
                <h2>По вопросам группы и беседы в вк</h2>
                <ButtonProfile
                    src={userDataVk[1]?.photo_100 || imgBasePhoto}
                    text={`${userDataVk[1]?.first_name || ""} ${userDataVk[1]?.last_name || ""}`}
                    onClick={() => window.open("https://vk.com/id396771911", "_blank")}
                />
                <ButtonProfile
                    src={userDataVk[2]?.photo_100 || imgBasePhoto}
                    text={`${userDataVk[2]?.first_name || ""} ${userDataVk[2]?.last_name || ""}`}
                    onClick={() => window.open("https://vk.com/id307642230", "_blank")}
                />
            </section>

            <section className="flex-col">
                <h2>По техническим вопросам сайта</h2>
                <ButtonProfile
                    src={userDataVk[0]?.photo_100 || imgBasePhoto}
                    text={`${userDataVk[0]?.first_name || ""} ${userDataVk[0]?.last_name || ""}`}
                    onClick={() => window.open("https://vk.com/id291195777", "_blank")}
                />
                <Link className="about__link-support" to={"/support/feedback"}>
                    <small className="text-gray link-image">Где оставить обратную связь (идеи/баги)</small>
                </Link>
            </section>

            <AboutReviews />
        </article>
    )
}
