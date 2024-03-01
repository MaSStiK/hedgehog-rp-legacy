import { useEffect } from "react"
import Aside from "../Aside/Aside"
import { setPageTitle } from "../Global"
import $ from "jquery"

import "./PageSettings.css"

export default function PageSettings() {
    useEffect(() => {setPageTitle("Настройки")}, [])

    function handleChangeEffects(style) {
        $("body").attr("effect", style)
        localStorage.pageEffect = style
    }

    return (
        <>
            <Aside />

            <article>
                <h4 className="page-title">/ Настройки</h4>

                <section className="se flex-col">
                    <h3>Эффекты страницы</h3>

                    <div className="settings__effects-input flex-row">
                        <input type="radio" name="page-effects" id="effects-default"
                            onChange={() => {handleChangeEffects("default")}}
                            defaultChecked={localStorage.pageEffect === "default" || localStorage.pageEffect === undefined}
                        />
                        <label htmlFor="effects-default">Без эффектов</label>
                    </div>
                    
                    <div className="settings__effects-input flex-row">
                        <input type="radio" name="page-effects" id="effects-newYear"
                            onChange={() => {handleChangeEffects("newYear")}}
                            defaultChecked={localStorage.pageEffect === "newYear"}
                        />
                        <label htmlFor="effects-newYear">Зима</label>
                    </div>
                </section>
            </article>
        </>
    )
}
