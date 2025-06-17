import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ButtonImage from "../ButtonImage/ButtonImage"
import Fullscreen from "../Fullscreen/Fullscreen"

import imgInfo from "../../assets/svg/Info.svg"
import imgArrowLeft from "../../assets/svg/Arrow-left.svg"
import imgArrowRight from "../../assets/svg/Arrow-right.svg"
import imgSeason1 from "../../assets/about/season1.png"
import imgSeason2 from "../../assets/about/season2.png"
import imgSeason3 from "../../assets/about/season3.png"
import imgSeason4 from "../../assets/about/season4.png"
import imgSeason5 from "../../assets/about/season5.png"

import "./Seasons.css"

const seasons = [
    {img: imgSeason1, chapter: "I", start: "3 июня 2020, 22:42 МСК", link: "/support/rp_lore_chapter1", planet: "Кулсториробоб", system: "Бетальгейзе", desc: "Социалистическая империя рухнула под давлением сепаратистов. В разгар вспыхнувшей гражданской войны между социалистами, национал-демократами и монархистами Даниил Вудергорский объявил о создании Ежиной Армии."},
    {img: imgSeason2, chapter: "II", start: "2 июля 2021, 19:48 МСК", link: "/support/rp_lore_chapter2", planet: "Кулсториробоб", system: "Бетальгейзе", desc: "Нашествие саурианцев вынудило 10 000 кулсториробян бежать на лунную сторону планеты. Они оказались в опасном мире, где уже господствовали гиены. Вокруг спасшихся стихийно сформировались новые силы: Инквизиция (Рим), Греческие царства (Ежи), Сицилия (Шотландия), а также укрывшиеся Пепси, Змеи, Лефаны и Единороги. Выживание в этом непрощающем мире стало их единственной целью."},
    {img: imgSeason3, chapter: "III", start: "29 октября 2023, 18:27 МСК", link: "/support/rp_lore_chapter3", planet: "Кулсториробоб", system: "Бетальгейзе", desc: "После разгрома претоиранцев, установилась Греческая доминация и мировое спокойствие. На холодном севере все крепче вставала на ноги Романья, последний наследник Рима. Но беда пришла, откуда не ждали: в Ежинии и Велуке коварные империалисты внезапно прорвались к власти."},
    {img: imgSeason4, chapter: "IV", start: "3 июня 2024, 23:17 МСК", link: "/support/rp_lore_chapter4", planet: "Динахон", system: "Базиликс", desc: "Столкнувшись с гибелью вселенной от Черной Звезды Бетельгейзе, боги Йешуа, Зевс, Гея и Эвиллиан создали новую вселенную в отчаянной попытке спасти жизнь. На планете Динахон, в полной изоляции друг от друга, медленно развивались народы Дикобразов, Утожей, Людей и Кентавров. Эпоха примитивного мира закончилась, когда жажда ресурсов привела дикобразов к войне со Скелетами."},
    {img: imgSeason5, chapter: "V", start: "3 мая 2025, 20:58 МСК", link: "/support/rp_lore_chapter5", planet: "Кулсториробоб и Динахон", system: "Бетальгейзе и Базиликс", desc: "Операция по спасению вселенной Базиликс от Бетельгейзе закончилась извержением из белой дыры поглощенный Кулсториробоб. Экспедиции с Динахона (Кентаврия, СДСР, КРИВС) и Ариралы с Аркейна обнаружили планету, опустошенную катастрофой. Они основали аванпосты, но быстро поняли, что столкнулись не с пустой землей, а с руинами более древней и развитой цивилизации."},
]

export default function AboutSeasons() {
    const [seasonsCounter, setSeasonsCounter] = useState(1) // Счетчик сезонов
    const [seasonWidth, setSeasonWidth] = useState(0) // Ширина сезона (Во всю ширину)
    const seasonContainer = useRef()
    const Navigate = useNavigate()

    function resizeAttach() { // Установка ширины картинки
        setSeasonWidth(seasonContainer.current ? seasonContainer.current.offsetWidth : 0)
    }
    window.addEventListener("resize", (resizeAttach)) // Обновляем ширину картинки при изменении ширины браузера
    useEffect(resizeAttach, [seasonContainer]) // Устанавливаем ширину картинки как только контейнер с картинками доступен
    
    function sliderPrev() { // Предыдущий элемент
        // Если первый элемент - ставим последний
        setSeasonsCounter(seasonsCounter === 1 ? seasons.length : seasonsCounter - 1)
    }

    function sliderNext() { // Следующий элемент
        // Если последний элемент - ставим первый
        setSeasonsCounter(seasonsCounter === seasons.length ? 1 : seasonsCounter + 1)
    }

    return (
        <section className="flex-col">
            <h1>Информация о сезонах</h1>
            <div className="seasons-wrapper" ref={seasonContainer}>
                <div className="seasons-container" style={{left: `${-seasonWidth * (seasonsCounter - 1)}px`}}>

                    {/* Рендер отзывов */}
                    {seasons.map((season, i) => (
                        <div className="season" key={i}>
                            <div className="flex-col season__content" style={{width: seasonWidth}}>
                                <Fullscreen>
                                    <img src={season.img} alt={`season-${season.chapter}`} draggable="false" />
                                </Fullscreen>
                                <div className="flex-col season__info">
                                    <h2>Глава {season.chapter}</h2>
                                    <p>{season.desc}</p>
                                    <div>
                                        <hr />
                                        <h4>Начало: {season.start}</h4>
                                        <h4>Планета: {season.planet}</h4>
                                        <h4>Система: {season.system}</h4>
                                    </div>

                                    <ButtonImage
                                        src={imgInfo}
                                        text={"Читать полную историю"}
                                        title={"Читать полную историю"}
                                        atStart
                                        onClick={() => Navigate(season.link)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            
            {/* Переключение отзывов */}
            <div className="flex-row seasons-control">
                <ButtonImage
                    src={imgArrowLeft}
                    alt="image-prev"
                    title="Предыдущий отзыв"
                    onClick={sliderPrev}
                />
                <p><span>{seasonsCounter}</span> из <span>{seasons.length}</span></p>
                <ButtonImage
                    src={imgArrowRight}
                    alt="image-next"
                    title="Следующий отзыв"
                    onClick={sliderNext}
                />
            </div>
        </section>
    )
}