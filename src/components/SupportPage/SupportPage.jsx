import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { setPageTitle } from "../Global"

import imgInfo from "../../assets/icons/Info.svg"
import imgHelp from "../../assets/icons/Help.svg"

import "./SupportPage.css"

export default function SupportPage() {
    useEffect(() => {setPageTitle("Помощь")}, [])
    const NavigateTo = useNavigate()

    return (
        <article>
            <h4 className="page-title">h/help</h4>

            <section className="flex-col">
                <h3>Статьи для решения проблем и вопросов</h3>
                <ButtonImage
                    src={imgHelp}
                    text="Где оставить обратную связь (идеи/баги)"
                    width100
                    atStart
                    onClick={() => NavigateTo("feedback")}
                />
                <ButtonImage
                    src={imgHelp}
                    text="Что такое токен авторизации"
                    width100
                    atStart
                    onClick={() => NavigateTo("auth-token")}
                />
                <ButtonImage
                    src={imgInfo}
                    text="Текстовый список создателей стран"
                    width100
                    atStart
                    onClick={() => NavigateTo("creators-list")}
                />
            </section>
        </article>
    )
}