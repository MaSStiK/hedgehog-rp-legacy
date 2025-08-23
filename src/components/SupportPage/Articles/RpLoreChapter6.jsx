import { useEffect } from "react"
import { setPageTitle } from "../../Global"
import Fullscreen from "../../Fullscreen/Fullscreen"
import ButtonToTop from "../../ButtonToTop/ButtonToTop"
import { ScrollToTitle } from "../SupportElements"

import imgScreenshot1 from "../../../assets/support/RpLoreChapter6/screenshot-1.png"


import "../SupportPage.css"

export default function RpLoreChapter5() {
    useEffect(() => {setPageTitle("История РП: Глава VI - Кассиопея - созвездие Единорога")}, [])

    return (
        <article>
            <h4 className="page-title">h/support/rp_lore/chapter6</h4>
            <ButtonToTop />

            <section className="flex-col">
                <h1>Глава VI - Кассиопея - созвездие Единорога</h1>
                <Fullscreen>
                    <img
                        src={imgScreenshot1}
                        alt="screenshot"
                        className="support-img"
                    />
                </Fullscreen>
                {/*<h2>Оглавление</h2>
                <ul className="support-ul">
                    <ScrollToTitle scrollTo="title1" text="..." />
                </ul>

                <h2 id="title1">...</h2>
                <h3>22.08.2025-XX.XX.20XX</h3>
                <p className="text-light"></p>*/}
                
            </section>
        </article>
    )
}