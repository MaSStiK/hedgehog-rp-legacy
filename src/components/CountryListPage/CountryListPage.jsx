import { useEffect, useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { setPageTitle, sortAlphabetically } from "../Global"
import imgListSearch from "../../assets/svg/ListSearch.svg"
import imgCross from "../../assets/svg/Cross.svg"

import "./CountryListPage.css"

export default function CountryListPage() {
    useEffect(() => {setPageTitle("Все страны")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()
    const searchRef = useRef()

    const [countryList, setCountryList] = useState([]);

    // Получаем список стран для отображения
    function getCountries(data) {
        let countries = []
        for (let user of data) {
            // Не отображаем людей без стран и "Обновления"
            if (user.country_id !== "") {
                countries.push({
                    country_id      : user.country_id,
                    country_name    : user.country_name,
                    country_tag     : user.country_tag,
                    country_bio     : user.country_bio,
                    country_photo   : user.country_photo,
                })
            }
        }
        return countries
    }

    useEffect(() => {
        // При обновлении контекста так же обновляется и массив
        setCountryList(sortAlphabetically(getCountries(Context.Users), "country_name"))
        searchCountries()

        // Когда загрузили массив участников - активируем инпут (только на пк)
        if (Context.Users.length && window.innerWidth >= 900) searchRef.current.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Context.Users])
    
    function searchCountries() {
        let filteredCountries = sortAlphabetically(getCountries(Context.Users), "country_name")
        let search = searchRef.current.value.toLowerCase()
        if (search) {
            filteredCountries = filteredCountries.filter(
                // Если есть поисковая строка в названии страны или в теге или в id
                country => country.country_name.toLowerCase().includes(search)
                || country.country_tag.toLowerCase().includes(search)
                || country.country_id.toLowerCase().includes(search)
            )
        }

        // Удаляем "Обновления" из списка
        filteredCountries = filteredCountries.filter(country => country.country_id !== "c769201685")
        setCountryList(filteredCountries)
    }

    return (
        <article>
            <h4 className="page-title">h/country</h4>

            <section className="flex-col">
                <h1>Список стран</h1>

                <div className="country-list__search flex-row">
                    <CustomInput label="Поиск страны" src={imgListSearch}>
                        <input
                            type="text"
                            ref={searchRef}
                            onInput={searchCountries}
                            required
                        />
                    </CustomInput>

                    <ButtonImage
                        src={imgCross}
                        alt="clear-search"
                        text="Отмена"
                        title="Отменить поиск"
                        phoneTextHide
                        onClick={() => {
                            // Отчищаем поле и активируем поиск
                            searchRef.current.value = ""
                            searchCountries()
                        }}
                        disabled={searchRef.current ? !searchRef.current.value : true}
                    />
                </div>

                {Context.Users.length !== 0
                    ? <>
                        {countryList.map((country) => (
                            <ButtonProfile
                                key={country.country_id}
                                src={country.country_photo}
                                text={country.country_name}
                                subText={country.country_tag}
                                onClick={() => Navigate("/country/" + country.country_id)}
                            />
                        ))}
                      </>
                    : <>
                        {/* Предпоказ */}
                        <ButtonProfile text="LoremLoremLorem" preview />
                        <ButtonProfile text="LoremLorem" preview />
                        <ButtonProfile text="LoremLoremLor" preview />
                        <ButtonProfile text="LoremLoremLo" preview />
                        <ButtonProfile text="LoremLoremLoremLorem" preview />
                      </>
                }
            </section>
        </article>
    )
}
