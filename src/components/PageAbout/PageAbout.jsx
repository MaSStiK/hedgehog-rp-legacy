import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Aside from "../Aside/Aside"
import CustomButton from "../CustomButton/CustomButton"


import "./PageAbout.css"

export default function PageAbout() {
    const Navigate = useNavigate()

    useEffect(() => {
        document.title = "О нас | Ежиное-РП"
    })

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title text-dark">/ О нас</h4>

                <section className="flex-col">
                    <h3>"Ежиное РП"</h3>
                    <p>Это группа единомышленников и друзей, которые объединились, чтобы писать историю собственного мира.
                        <br />Это творческая команда, которая занимается одновременно
                        <br />- Историей
                        <br />- Литературой
                        <br />- Искусством
                        <br />- Картографией
                    </p>
                </section>

                <section className="flex-col">
                    <h3>Наша группа в вк</h3>
                    <Link to={"https://vk.com/public196009619"} target="_blank">
                        <CustomButton
                            src={"https://sun6-23.userapi.com/s/v1/ig2/pW7tJ3hpvZD-e88U7HslMzAaBmW3y3ghVuaL_jYux0_XqjygMph6Kb4fioZRDeJmIknHeVyZlx9cYnF7nSpIgOiC.jpg?size=100x100&quality=95&crop=110,1,532,532&ava=1"}
                            text={"r/35reddit_hedgehogs"}
                        />
                    </Link>
                </section>

                <section className="flex-col">
                    <h3>По техническим вопросам сайта</h3>
                    <Link to={"https://vk.com/id291195777"} target="_blank">
                        <CustomButton
                            src={"https://sun6-20.userapi.com/s/v1/ig2/WszTdcPKGJNghoV8PZheNelluw2OLG64-rauheU_W72y7Wpboum2Uwf6vvCzS5PjtyOdi9jCBMcqjPZ5m9fI36NW.jpg?size=200x200&quality=95&crop=102,0,960,960&ava=1"}
                            text={"Мотя Овчинников"}
                        />
                    </Link>
                </section>

                <section className="flex-col">
                    <h3>По вопросам группы и беседы в вк</h3>
                    <Link to={"https://vk.com/id396771911"} target="_blank">
                        <CustomButton
                            src={"https://sun6-20.userapi.com/s/v1/ig2/jx51wmviOXcqwH09UZsJcsGQM0_Ay-__FAHizuGxNS95y8-ZiqrUUObX5fxoOnGQ7IlYCOkP98frXsPF7OIzu2R9.jpg?size=200x200&quality=95&crop=0,35,567,567&ava=1"}
                            text={"Алексей Дедов"}
                        />
                    </Link>
                </section>

                <section className="flex-col">
                    <h3>Администратор беседы</h3>
                    <Link to={"https://vk.com/id307642230"} target="_blank">
                        <CustomButton
                            src={"https://sun6-20.userapi.com/s/v1/ig2/S8MT6cyPtLiwonjaAC45gSPZI4xvj_uWajX2sNJIkdWO7J9cuPxL8sL0Et9cxF5FAqiJJZfChKqjw-dl5JIJA5KC.jpg?size=200x200&quality=96&crop=438,340,522,522&ava=1"}
                            text={"Никита Ванжа"}
                        />
                    </Link>
                </section>
            </article>
        </>
    )
}
