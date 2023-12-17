import { useEffect, useContext, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { DataContext } from "../Context"
import CustomInput from "../CustomInput/CustomInput"
import CustomButton from "../CustomButton/CustomButton"
import Aside from "../Aside/Aside"

import "./UsersPage.css"

export default function UsersPage() {
    const Context = useContext(DataContext)
    const searchRef = useRef()

    const [usersRender, setusersRender] = useState([]);

    // Фильтр юзеров в алфавитном порядке
    function sortUsers(data) {
        return data.sort((a, b) => {
            return a.name.localeCompare(b.name)
        })
    }

    useEffect(() => {
        document.title = "Все участники | Ежиное-РП"
    }, [])

    useEffect(() => {
        // При обновлении контекста так же обновляется и массив
        setusersRender(sortUsers(Context.users))
        searchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Context.users])
    
    const searchUsers = () => {
        let filteredUsers = sortUsers(Context.users).filter(
            // Если есть поисковая строка в имени юзера или в теге или в id
            user => user.name.toLowerCase().includes(searchRef.current.value.toLowerCase())
            || user.tag.toLowerCase().includes(searchRef.current.value.toLowerCase())
            || user.id.toLowerCase().includes(searchRef.current.value.toLowerCase())
        )
        setusersRender(filteredUsers)
    }

    return (
        <>
            <Aside />
            
            <article id="article-users">
                <h4 className="page-title text-dark">/ Все участники</h4>

                <section className="section-users">
                    <CustomInput label="Поиск участника">
                        <input type="text" ref={searchRef} onInput={searchUsers} required />
                    </CustomInput>
                    {usersRender.map((user) => (
                        <Link to={"/users/" + user.id} key={user.id}>
                            <CustomButton
                                src={user.photo}
                                text={user.name}
                                subText={user.tag} 
                            />
                        </Link>
                    ))}
                </section>
            </article>
        </>
    )
}
