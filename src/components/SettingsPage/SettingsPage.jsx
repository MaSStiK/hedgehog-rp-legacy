import { useState, useEffect, useContext } from "react"
import { DataContext } from "../Context"
import { setPageTitle } from "../Global"
import CustomSelect from "../CustomSelect/CustomSelect";
import SettingsSave from "./SettingsSave";

import "./SettingsPage.css"
import "./SettingsPage-phone.css"

const effectsOptions = [
    {value: "default", label: "По умолчанию"},
    {value: "snow", label: "Зимняя тема"},
    // {value: "hedgehog34", label: "hedgehog34"},
]

const backgroundsOptions = [
    {value: "bg1", label: "Лесной (По умолчанию)"},
    {value: "bg2", label: "Ночной"},
    {value: "bg3", label: "Подсолнух и ёж"},
    {value: "bg4", label: "Поле ромашек"},
    {value: "bgSnow", label: "Зимний ёж"},
    // {value: "bgLink", label: "Свой фон"},
    {value: "false", label: "Отключен"},
]

const buttonToTopOptions = [
    {value: "true", label: "Включена"},
    {value: "false", label: "Отключена"},
]

export default function SettingsPage() {
    useEffect(() => {setPageTitle("Настройки")}, [])
    const Context = useContext(DataContext)

    const [Settings, setSettings] = useState(Context.PageSettings) // Установленные настройки

    function changeSettings(key, value) {
        let pageSettings = {...Context.PageSettings}
        pageSettings[key] = value
        localStorage.PageSettings = JSON.stringify(pageSettings) // Сохраняем настройки в память браузера
        Context.setPageSettings(pageSettings)
        setSettings(pageSettings)

        // Если пользователь авторизован
        if (Context.UserData) SettingsSave(Context, pageSettings)
    }

    return (
        <article>
            <h4 className="page-title">h/settings</h4>

            <section className="flex-col">
                <h3>Эффекты страницы</h3>
                <CustomSelect
                    options={effectsOptions}
                    values={effectsOptions[
                        effectsOptions.findIndex(option => option.value === Settings["theme"]) >= 0
                        ? effectsOptions.findIndex(option => option.value === Settings["theme"])
                        : 0
                    ]} // Значение по умолчанию
                    onChange={value => changeSettings("theme", value[0].value)}
                />

                <h3>Задний фон страницы</h3>
                <CustomSelect
                    options={backgroundsOptions}
                    values={backgroundsOptions[
                        backgroundsOptions.findIndex(option => option.value === Settings["bg"]) >= 0
                        ? backgroundsOptions.findIndex(option => option.value === Settings["bg"])
                        : 0
                    ]} // Значение по умолчанию
                    onChange={value => changeSettings("bg", value[0].value)}
                />
                
                <div className="flex-col settings__phone-hide">
                    <hr />

                    <h3>Кнопка "Наверх страницы"<br /><p className="text-gray">(Доступна только на пк)</p></h3>
                    <CustomSelect
                        options={buttonToTopOptions}
                        values={buttonToTopOptions[
                            buttonToTopOptions.findIndex(option => option.value === Settings["buttonToTop"]) >= 0
                            ? buttonToTopOptions.findIndex(option => option.value === Settings["buttonToTop"])
                            : 0
                        ]} // Значение по умолчанию
                        onChange={value => changeSettings("buttonToTop", value[0].value)}
                        dropdownPosition="top"
                    />
                </div>
            </section>
        </article>
    )
}
