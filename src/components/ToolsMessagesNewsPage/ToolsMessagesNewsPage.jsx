import { useState, useEffect, useRef, useContext } from "react"
import { useLocation } from "react-router-dom"
import { DataContext } from "../Context"
import { setPageTitle } from "../Global"
import CustomInput from "../CustomInput/CustomInput"
import MessagesGet from "./MessagesGet"
import MessageRender from "./MessageRender"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgListSearch from "../../assets/svg/ListSearch.svg"
import imgCross from "../../assets/svg/Cross.svg"
import imgLoad from "../../assets/svg/Load.svg"

import "./ToolsMessagesNewsPage.css"
import "./ToolsMessagesNewsPage-phone.css"

export default function ToolsMessagesNewsPage() {
    useEffect(() => {setPageTitle("Поиск сообщения")}, [])
    const Context = useContext(DataContext)
    const Location = useLocation()

    const [isMessagesLoaded, setIsMessagesLoaded] = useState(false) // Показывать сообщение о загрузке сообщений
    const [disableLoadButton, setDisableLoadButton] = useState(false) // Блокировать кнопку загрузки сообщений

    const [vkData, setVkData] = useState({messages: [], profiles: []})
    const [vkMessages, setVkMessages] = useState([])
    const [vkMessagesOffset, setVkMessagesOffset] = useState(0)

    const searchRef = useRef()
    
    // Получение сообщений при загрузке страницы
    useEffect(() => {
        MessagesLoad(0)
    }, [])

    function MessagesLoad(offset) {
        setDisableLoadButton(true) // Блокируем кнопку

        MessagesGet(Context, offset, Location.state?.noFilter)
        .then(data => {
            data.messages = [...vkData.messages].concat(data.messages)
            setVkData(data) // Обновляем все посты
            setVkMessages(data.messages) // И список отображаемых постов
            setVkMessagesOffset(offset) // Обновляем offset
            setDisableLoadButton(false) // Разблокируем кнопку
            if (!isMessagesLoaded) setIsMessagesLoaded(true) // Отключаем текст с загрузкой и показываем блок сообщениями
            if (searchRef.current) searchMessage(data.messages) // Активируем поиск
        })
    }

    // Поиск сообщения
    function searchMessage(messages) {
        let search = searchRef.current.value.toLowerCase()
        // Берем весь общий массив сообщений и ищем в нем
        if (search) { // Если поиск пустой - отображаются все сообщения
            messages = messages.filter(message => message.text.toLowerCase().includes(search))
        }
        setVkMessages(messages)
    }

    return (
        <article>
            <h4 className="page-title">h/tools/message-news</h4>

            <section className={`vk-messages-section flex-col ${vkData.messages.length !== 0 && "vk-messages-section_min-height"}`}>
                <h1>Новость из сообщения в ВК</h1>
                <p className="text-light">Найдите нужное сообщение и нажмите на него для создания новости.
                    <br />Если нужное сообщения нет найдено, то вы можете загрузить больше сообщений.
                </p>
                {isMessagesLoaded
                    ? <>
                        <small className="text-gray">• Сообщения без текста не будут отображаться</small>
                        <div className="vk-messages__search flex-row">
                            <CustomInput label="Поиск сообщения" src={imgListSearch}>
                                <input
                                    type="text"
                                    ref={searchRef}
                                    onInput={() => searchMessage(vkData.messages)}
                                    required
                                />
                            </CustomInput>

                            <ButtonImage
                                src={imgCross}
                                alt="clear-search"
                                text="Отмена"
                                title="Отменит поиск"
                                phoneTextHide
                                onClick={() => {
                                    // Отчищаем поле и активируем поиск
                                    searchRef.current.value = ""
                                    searchMessage(vkData.messages)
                                }}
                                disabled={searchRef.current ? !searchRef.current.value : true}
                            />
                        </div>
                        <div className="vk-messages__search-info flex-row">
                            <span className="small text-gray">Загружено сообщений: {vkMessagesOffset + 200}</span>
                            <span className="small text-gray">|</span>
                            <span className="small text-gray">Из них ваши: {vkData.messages.length}</span>
                        </div>
                        <hr />
                        <div className="vk-messages">
                            {vkMessages.length
                                ? <>
                                    {vkMessages.map(message => (
                                        <MessageRender
                                            key={message.id}
                                            message={message}
                                            profiles={vkData.profiles}
                                        />
                                    ))}
                                  </>
                                : <p>Сообщение не найдено</p>
                            }
                        </div>
                        <hr />
                        <ButtonImage
                            src={imgLoad}
                            alt="load-more"
                            text="Загрузить больше"
                            title="Загрузить больше сообщений"
                            onClick={() => MessagesLoad(vkMessagesOffset + 200)}
                            disabled={disableLoadButton}
                            width100
                        />
                      </>
                    : <p>Загрузка сообщений</p>
                }
            </section>
        </article>
    )
}
