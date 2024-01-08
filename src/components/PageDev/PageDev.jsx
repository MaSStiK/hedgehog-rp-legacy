import { useState, useEffect, useRef, useContext } from "react"
import { Link } from "react-router-dom"
import CustomInput from "../CustomInput/CustomInput"
import ButtonIcon from "../ButtonIcon/ButtonIcon"
import Aside from "../Aside/Aside"
import { DataContext } from "../Context"
import imgSearch from "../../assets/icons/Search.svg"
import imgPrivate from "../../assets/icons/Private.svg"
import imgCopy from "../../assets/icons/Copy.svg"
import imgEdit from "../../assets/icons/Edit.svg"


import "./PageDev.css"

export default function PageDev() {
    const Context = useContext(DataContext)

    useEffect(() => {
        document.title = "dev | Ежиное-РП"
    }, [])


    const [exampleInputValue, setexampleInputValue] = useState("");
    const [exampleTextareaValue, setexampleTextareaValue] = useState("");
    const [exampleInputError, setexampleInputError] = useState(false);
    const [disableErrorButton, setdisableErrorButton] = useState(false);

    const exampleInput = useRef()
    const exampleTextarea = useRef()

    const handleErrorButton = () => {
        setexampleInputError(true)
        setTimeout(() => setexampleInputError(false), 2000)
        setdisableErrorButton(true)
        setTimeout(() => setdisableErrorButton(false), 2000)
    }

    return (
        <>
            <Aside />
            
            <article>
                <h4 className="page-title text-dark">/ dev</h4>

                <section className="flex-col">
                    <h1>Never gonna give you up</h1>
                    <h2>Never gonna let you down</h2>
                    <h3>Never gonna run around and desert you</h3>
                    <h4>Never gonna make you cry</h4>
                    <p>Never gonna say goodbye</p>
                    <p><small>Never gonna tell a lie and hurt you</small></p>

                    <p><br />Context.isAdmin: {`${Context.isAdmin}`}</p>
                </section>

                <section className="flex-col">
                    <button>gray (standart)</button>
                    <button className="green">green (confirm)</button>
                    <button className="red">red (cancel)</button>
                    <button className="tp">tp (transparent)</button>
                    <button disabled>disabled</button>
                    <Link to={"#"} className="text-link">Текст-ссылка по которой можно куда то попасть</Link>

                    <div className="flex-row">
                        <ButtonIcon 
                            src={imgSearch}
                            alt="button-test"
                        />
                        <ButtonIcon 
                            src={imgPrivate}
                            alt="button-test"
                        />
                        <ButtonIcon 
                            src={imgCopy}
                            alt="button-test"
                        />
                        <ButtonIcon 
                            src={imgEdit}
                            alt="button-test"
                        />
                    </div>
                </section>
                    
                <section className="flex-col">
                    <CustomInput label="Пример с длинным название инпута">
                        <input ref={exampleInput} type="text" className={exampleInputError ?  "error" : null} required
                        onChange={() => {setexampleInputValue(exampleInput.current.value)}} />
                    </CustomInput>
                    <p>{"Инпут: " + exampleInputValue}</p>
                    <button disabled={disableErrorButton} onClick={handleErrorButton}>Сделать ошибку</button>

                    <CustomInput label="Только читаемый инпут">
                        <input type="text" required readOnly value={"Пример описания"} />
                    </CustomInput>
                </section>

                <section className="flex-col">
                    <CustomInput label="Пример текстареа">
                        <textarea ref={exampleTextarea} required
                        onChange={() => {setexampleTextareaValue(exampleTextarea.current.value)}}></textarea>
                    </CustomInput>
                    <p>{"Текстареа: " + exampleTextareaValue}</p>
                </section>

                <section className="flex-col">
                    <CustomInput label="Инпут с паролем" password={true}>
                        <input type="password" id="password" required/>
                    </CustomInput>

                    <CustomInput label="Инпут с повтором пароля" password={true}>
                        <input type="password" id="password-again" required />
                    </CustomInput>

                    <button onClick={() => {localStorage.clear()}}>Delete userData</button>
                </section>
            </article>
        </>
    )
}