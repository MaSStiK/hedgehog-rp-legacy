import { useEffect, useContext, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { setPageTitle, sortAlphabetically } from "../Global"

import "./UserListPage.css"

export default function UserListPage() {
    useEffect(() => {setPageTitle("Все участники")}, [])
    const Context = useContext(DataContext)
    const searchRef = useRef()

    const [usersRender, setUsersRender] = useState([]);

    useEffect(() => {
        // При обновлении контекста так же обновляется и массив
        setUsersRender(sortAlphabetically(Context.users, "name"))
        searchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Context.users])
    
    function searchUsers() {
        let filteredUsers = sortAlphabetically(Context.users, "name").filter(
            // Если есть поисковая строка в имени юзера или в теге или в id
            user => user.name.toLowerCase().includes(searchRef.current.value.toLowerCase())
            || user.tag.toLowerCase().includes(searchRef.current.value.toLowerCase())
            || user.id.toLowerCase().includes(searchRef.current.value.toLowerCase())
        )
        setUsersRender(filteredUsers)
    }

    return (
        <article>
            <h4 className="page-title">h/user</h4>

            <section className="flex-col">
                <CustomInput label="Поиск участника">
                    <input type="text" ref={searchRef} onInput={searchUsers} required />
                </CustomInput>
                {usersRender.map((user) => (
                    <Link to={"/user/" + user.id} key={user.id}>
                        <ButtonProfile
                            src={user.photo}
                            text={user.name}
                            subText={user.tag} 
                        />
                    </Link>
                ))}
            </section>
        </article>
    )
}
