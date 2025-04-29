import { useState, useContext, useEffect } from "react"
import { DataContext } from "../Context"
import { timestampToDate } from "../Global"

import imgCalendar from "../../assets/svg/Calendar.svg"

function getCalendar(calendar) {
    if (!calendar.event_2020 && !calendar.event_2021 && !calendar.event_2022 && !calendar.event_2023 && !calendar.event_2024 && !calendar.event_2025) {
        return <p className="calendar-text">Либо Даниил не заполнил календарь, либо сегодня не было значимых событий</p>
    }
    
    return (
        <>
            {calendar.event_2020 && <p className="calendar-text">2020 ({calendar.year_2020}): {calendar.event_2020}</p>}
            {calendar.event_2021 && <p className="calendar-text">2021 ({calendar.year_2021}): {calendar.event_2021}</p>}
            {calendar.event_2022 && <p className="calendar-text">2022 ({calendar.year_2022}): {calendar.event_2022}</p>}
            {calendar.event_2023 && <p className="calendar-text">2023 ({calendar.year_2023}): {calendar.event_2023}</p>}
            {calendar.event_2024 && <p className="calendar-text">2024 ({calendar.year_2024}): {calendar.event_2024}</p>}
            {calendar.event_2025 && <p className="calendar-text">2025 ({calendar.year_2025}): {calendar.event_2025}</p>}
        </>
    )
}

export default function HomeCalendar() {
    const Context = useContext(DataContext)
    const [calendar, setCalendar] = useState({})

    useEffect(() => {
        if (Context.Calendar.length !== 0) {
            const date = timestampToDate(new Date())
            const today = `${date.day}.${date.month}`
            const todayCalendar = Context.Calendar.find(item => item.date === today)
            setCalendar(todayCalendar)
        }
    }, [Context.Calendar])

    return (
        <>
            {Object.keys(calendar).length !== 0
                ?  <section className="flex-col">
                        <div className="flex-row">
                            <img src={imgCalendar} alt="calendar" />
                            <h3>24 мая,</h3>
                            <h3 className="text-gray">Вторник</h3>
                        </div>
                        <div>
                            {getCalendar(calendar)}
                        </div>
                    </section>
                : <section className="flex-col">
                        <div className="flex-row">
                            <img src={imgCalendar} alt="calendar" />
                            <h3 className="text-preview">00 xxx,</h3>
                            <h3 className="text-preview">Вторник</h3>
                        </div>
                        <div>
                            <p className="text-preview">Нового года не будет!</p>
                            <p className="text-preview">Нового года не будет!</p>
                            <p className="text-preview">Нового года не будет!</p>
                        </div>
                    </section>
            }
        </>
    )
}