import { useEffect, useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { setPageTitle, sortAlphabetically } from "../Global"
import imgUserSearch from "../../assets/icons/UserSearch.svg"
import imgCross from "../../assets/icons/Cross.svg"

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
        setUsersRender(sortAlphabetically(Context.users, "name"))
        searchUsers()

        // Когда загрузили массив участников - активируем инпут (только на пк)
        if (Context.users.length && window.innerWidth >= 900) searchRef.current.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Context.users])
    
    function searchUsers(search) {
        let sortedUsers = sortAlphabetically(Context.users, "name")
        if (search) {
            sortedUsers = sortedUsers.filter(
                // Если есть поисковая строка в имени юзера или в теге или в id
                user => user.name.toLowerCase().includes(search)
                || user.tag.toLowerCase().includes(search)
                || user.id.toLowerCase().includes(search)
            )
        }
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
                            onInput={() => searchUsers(searchRef.current.value.toLowerCase())}
                            required
                        />
                    </CustomInput>

                    <ButtonImage
                        src={imgCross}
                        alt="clear-search"
                        text="Отчистить"
                        onClick={() => {
                            // Отчищаем поле и активируем поиск
                            searchRef.current.value = ""
                            searchUsers()
                        }}
                        disabled={searchRef.current ? !searchRef.current.value : true}
                    />
                </div>
                
                {usersRender.map((user) => (
                    <ButtonProfile
                        key={user.id}
                        src={user.photo}
                        text={user.name}
                        subText={user.tag}
                        onClick={() => Navigate("/user/" + user.id)}
                    />
                ))}
            </section>
        </article>
    )
}
