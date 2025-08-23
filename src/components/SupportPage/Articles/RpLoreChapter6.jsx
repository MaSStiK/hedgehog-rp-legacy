import { useEffect } from "react"
import { setPageTitle } from "../../Global"
import ButtonToTop from "../../ButtonToTop/ButtonToTop"
import { ScrollToTitle, SupportImg } from "../SupportElements"

import imgPart1 from "../../../assets/support/RpLoreChapter6/part-1.png"

import "../SupportPage.css"

export default function RpLoreChapter5() {
    useEffect(() => {setPageTitle("История РП: Глава VI - Кассиопея - созвездие Единорога")}, [])

    return (
        <article>
            <h4 className="page-title">h/support/rp_lore/chapter6</h4>
            <ButtonToTop />

            <section className="flex-col support-section">
                <h1>Глава VI - Кассиопея - созвездие Единорога</h1>
                <SupportImg src={imgPart1} />
                {/*<h2>Оглавление</h2>
                <ul className="support-ul">
                    <ScrollToTitle scrollTo="title1" text="..." />
                </ul>*/}
                
            </section>

            {/* <section className="flex-col support-section" id="title1">
                <h2>...</h2>
                <h3>22.08.2025-XX.XX.20XX</h3>
                <p></p>
            </section> */}
        </article>
    )
}