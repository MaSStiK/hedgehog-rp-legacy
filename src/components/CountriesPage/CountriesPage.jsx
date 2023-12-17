import { useEffect, useContext, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import CustomButton from "../CustomButton/CustomButton"
import Aside from "../Aside/Aside"

import "./CountriesPage.css"

export default function CountriesPage() {
    const Context = useContext(DataContext)
    const searchRef = useRef()

    const [countriesRender, setcountriesRender] = useState([]);

    useEffect(() => {
        document.title = "Все страны | Ежиное-РП"
    }, [])

    // Фильтр стран в алфавитном порядке
    function sortCountries(data) {
        return data.sort((a, b) => {
            return a.country_title.localeCompare(b.country_title)
        })
    }

    function getCountries(data) {
        let countries = []
        for (let user of data) {
            if (user.country_id !== "") {
                countries.push({
                    country_id: user.country_id,
                    country_tag: user.country_tag,
                    country_title: user.country_title,
                    country_photo: user.country_photo,
                    // country_bio_main: user.country_bio_main,
                    // country_bio_more: user.country_bio_more,
                })
            }
        }
        return countries
    }

    useEffect(() => {
        // При обновлении контекста так же обновляется и массив
        setcountriesRender(sortCountries(getCountries(Context.users)))
        searchCountries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Context.users])
    
    const searchCountries = () => {
        let filteredUsers = sortCountries(getCountries(Context.users)).filter(
            // Если есть поисковая строка в названии страны или в теге или в id
            country => country.country_title.toLowerCase().includes(searchRef.current.value.toLowerCase())
            || country.country_tag.toLowerCase().includes(searchRef.current.value.toLowerCase())
            || country.country_id.toLowerCase().includes(searchRef.current.value.toLowerCase())
        )
        setcountriesRender(filteredUsers)
    }

    return (
        <>
            <Aside />
            
            <article id="article-users">
                <h4 className="page-title text-dark">/ Все страны</h4>

                <section className="section-countries">
                    <CustomInput label="Поиск страны">
                        <input type="text" ref={searchRef} onInput={searchCountries} required />
                    </CustomInput>
                    {countriesRender.map((country) => (
                        <Link to={"/countries/" + country.country_id} key={country.country_id}>
                            <CustomButton
                                src={country.country_photo}
                                text={country.country_title}
                                subText={country.country_tag} 
                            />
                        </Link>
                    ))}
                </section>
            </article>
        </>
    )
}
