import { useEffect, useContext, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import Aside from "../Aside/Aside"
import { CONSTS, sortAlphabetically } from "../Global"

import "./PageCountries.css"

export default function PageCountries() {
    const Context = useContext(DataContext)
    const searchRef = useRef()

    const [countriesRender, setcountriesRender] = useState([]);

    useEffect(() => {
        document.title = "Все страны" + CONSTS.pageName
    }, [])


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
        setcountriesRender(sortAlphabetically(getCountries(Context.users), "country_title"))
        searchCountries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Context.users])
    
    const searchCountries = () => {
        let filteredUsers = sortAlphabetically(getCountries(Context.users), "country_title").filter(
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
            
            <article>
                <h4 className="page-title text-dark">/ Все страны</h4>

                <section className="flex-col">
                    <CustomInput label="Поиск страны">
                        <input type="text" ref={searchRef} onInput={searchCountries} required />
                    </CustomInput>
                    {countriesRender.map((country) => (
                        <Link to={"/countries/" + country.country_id} key={country.country_id}>
                            <ButtonProfile
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
