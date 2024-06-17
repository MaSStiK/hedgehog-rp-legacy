import { useEffect, useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { setPageTitle, sortAlphabetically } from "../Global"
import imgUserSearch from "../../assets/svg/UserSearch.svg"
import imgCross from "../../assets/svg/Cross.svg"

import "./UserListPage.css"
import "./UserListPage-phone.css"

export default function UserListPage() {
    useEffect(() => {setPageTitle("Все участники")}, [])
    const Context = useContext(DataContext)
    const Navigate = useNavigate()
    const searchRef = useRef()

    const [usersRender, setUsersRender] = useState([]);

    useEffect(() => {
        // При обновлении контекста так же обновляется и массив
        setUsersRender(sortAlphabetically(Context.Users, "name"))
        searchUsers()

        // Когда загрузили массив участников - активируем инпут (только на пк)
        if (Context.Users.length && window.innerWidth >= 900) searchRef.current.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Context.Users])
    
    function searchUsers() {
        let sortedUsers = sortAlphabetically(Context.Users, "name")
        let search = searchRef.current.value.toLowerCase()
        if (search) {
            sortedUsers = sortedUsers.filter(
                // Если есть поисковая строка в имени юзера или в теге или в id
                user => user.name.toLowerCase().includes(search)
                || user.tag.toLowerCase().includes(search)
                || user.id.toLowerCase().includes(search)
            )
        }

        // Удаляем админа из списка
        sortedUsers = sortedUsers.filter(user => user.id !== "769201685")
        setUsersRender(sortedUsers)
    }
    return (
        <article>
            <h4 className="page-title">h/user</h4>

            <section className="flex-col">
                <h1>Список участников</h1>
                <div className="user-list__search flex-row">
                    <CustomInput label="Поиск участника" src={imgUserSearch}>
                        <input
                            type="text"
                            ref={searchRef}
                            onInput={searchUsers}
                            required
                        />
                    </CustomInput>

                    <ButtonImage
                        src={imgCross}
                        alt="clear-search"
                        text="Отмена"
                        title="Отменить поиск"
                        onClick={() => {
                            // Отчищаем поле и активируем поиск
                            searchRef.current.value = ""
                            searchUsers()
                        }}
                        disabled={searchRef.current ? !searchRef.current.value : true}
                    />
                </div>

                {Context.Users.length
                    ? <>
                        {usersRender.map((user) => (
                            <ButtonProfile
                                key={user.id}
                                src={user.photo}
                                text={user.name}
                                subText={user.tag}
                                onClick={() => Navigate("/user/" + user.id)}
                            />
                        ))}
                      </>
                    : <>
                        {/* Предпоказ */}
                        <ButtonProfile text="LoremLorem" preview />
                        <ButtonProfile text="LoremLoremLorem" preview />
                        <ButtonProfile text="LoremLoremLo" preview />
                        <ButtonProfile text="LoremLoremLor" preview />
                        <ButtonProfile text="LoremLoremLo" preview />
                        <ButtonProfile text="LoremLor" preview />
                        <ButtonProfile text="LoremLoremLoremLorem" preview />
                        <ButtonProfile text="LoremLoremLo" preview />
                        <ButtonProfile text="LoremLoremLor" preview />
                        <ButtonProfile text="LoremLorem" preview />
                      </>
                }
            </section>
        </article>
    )
}
