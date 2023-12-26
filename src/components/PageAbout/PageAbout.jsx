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
                    <Link to={"https://vk.com/public196009619"} target="_blank" rel="noopener noreferrer">
                        <CustomButton
                            src={"https://sun6-23.userapi.com/s/v1/ig2/pW7tJ3hpvZD-e88U7HslMzAaBmW3y3ghVuaL_jYux0_XqjygMph6Kb4fioZRDeJmIknHeVyZlx9cYnF7nSpIgOiC.jpg?size=100x100&quality=95&crop=110,1,532,532&ava=1"}
                            text={"r/35reddit_hedgehogs"}
                        />
                    </Link>
                </section>
            </article>
        </>
    )
}
