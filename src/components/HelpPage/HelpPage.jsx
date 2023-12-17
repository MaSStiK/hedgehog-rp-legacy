import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Aside from "../Aside/Aside"
import CustomButton from "../CustomButton/CustomButton"


import "./HelpPage.css"

export default function HelpPage() {
    const Navigate = useNavigate()

    useEffect(() => {
        document.title = "Помощь | Ежиное-РП"
    })

    return (
        <>
            <Aside />

            <article id="article-help">
                <h4 className="page-title text-dark">/ Помощь</h4>

                <section className="section-help__column">
                    <h3>По техническим вопросам сайта</h3>
                    <Link to={"https://vk.com/id291195777"} target="_blank" rel="noopener noreferrer">
                        <CustomButton
                            src={"https://sun6-20.userapi.com/s/v1/ig2/WszTdcPKGJNghoV8PZheNelluw2OLG64-rauheU_W72y7Wpboum2Uwf6vvCzS5PjtyOdi9jCBMcqjPZ5m9fI36NW.jpg?size=200x200&quality=95&crop=102,0,960,960&ava=1"}
                            text={"Мотя Овчинников"}
                        />
                    </Link>
                </section>

                <section className="section-help__column">
                    <h3>По вопросам группы и беседы в вк</h3>
                    <Link to={"https://vk.com/id396771911"} target="_blank" rel="noopener noreferrer">
                        <CustomButton
                            src={"https://sun6-20.userapi.com/s/v1/ig2/jx51wmviOXcqwH09UZsJcsGQM0_Ay-__FAHizuGxNS95y8-ZiqrUUObX5fxoOnGQ7IlYCOkP98frXsPF7OIzu2R9.jpg?size=200x200&quality=95&crop=0,35,567,567&ava=1"}
                            text={"Алексей Дедов"}
                        />
                    </Link>
                </section>

                <section className="section-help__column">
                    <h3>Администратор беседы</h3>
                    <Link to={"https://vk.com/id307642230"} target="_blank" rel="noopener noreferrer">
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
