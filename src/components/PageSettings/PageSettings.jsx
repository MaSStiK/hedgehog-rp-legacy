import { useEffect } from "react"
import Aside from "../Aside/Aside"
import { setPageTitle } from "../Global"
import $ from "jquery"

import "./PageSettings.css"

export default function PageSettings() {
    useEffect(() => {setPageTitle("Настройки")}, [])

    function handleChangeTheme(style) {
        $("body").attr("theme", style)
        localStorage.pageTheme = style
    }

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title">/ Настройки</h4>

                <section className="se flex-col">
                    <h3>Эффекты страницы</h3>

                    <div className="settings__theme-input flex-row">
                        <input type="radio" name="page-theme" id="theme-default"
                            onChange={() => {handleChangeTheme("default")}}
                            defaultChecked={localStorage.pageTheme === "default" || localStorage.pageTheme === undefined}
                        />
                        <label htmlFor="theme-default">По умолчанию</label>
                    </div>
                    
                    <div className="settings__theme-input flex-row">
                        <input type="radio" name="page-theme" id="theme-newYear"
                            onChange={() => {handleChangeTheme("newYear")}}
                            defaultChecked={localStorage.pageTheme === "newYear"}
                        />
                        <label htmlFor="theme-newYear">Зимняя тема</label>
                    </div>
                </section>
            </article>
        </>
    )
}
