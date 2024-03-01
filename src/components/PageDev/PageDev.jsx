import { useState, useEffect, useRef, useContext } from "react"
import { Link } from "react-router-dom"
import CustomInput from "../CustomInput/CustomInput"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import Aside from "../Aside/Aside"
import { DataContext } from "../Context"
import { setPageTitle } from "../Global"
import imgSearch from "../../assets/icons/Search.svg"
import imgPrivate from "../../assets/icons/Private.svg"
import imgCopy from "../../assets/icons/Copy.svg"
import imgEdit from "../../assets/icons/Edit.svg"
import imgBasePhoto from "../../assets/replace/base-photo.png"


import "./PageDev.css"

export default function PageDev() {
    useEffect(() => {setPageTitle("dev")}, [])
    const Context = useContext(DataContext)

    function openModal() {
        Context.setModalData(
            <p>Модальное окно</p>
        )
    }


    const [exampleInputValue, setExampleInputValue] = useState("");
    const [exampleTextareaValue, setExampleTextareaValue] = useState("");
    const [exampleInputError, setExampleInputError] = useState(false);
    const [disableErrorButton, setDisableErrorButton] = useState(false);

    const exampleInput = useRef()
    const exampleTextarea = useRef()

    function handleErrorButton() {
        setExampleInputError(true)
        setTimeout(() => setExampleInputError(false), 2000)
        setDisableErrorButton(true)
        setTimeout(() => setDisableErrorButton(false), 2000)
    }

    const test = {
        a: 0,
        b: 0,
        c: {
            name: 1,
            color: 1,
            label: {
                a: {
                    name: 1
                },
                b: 15
            }
        }
    }

    return (
        <>
            <Aside />
            
            <article>
                <h4 className="page-title">/ dev</h4>

                <section className="flex-col">
                    <h1>Never gonna give you up</h1>
                    <h2>Never gonna let you down</h2>
                    <h3>Never gonna run around and desert you</h3>
                    <h4>Never gonna make you cry</h4>
                    <p>Never gonna say goodbye</p>
                    <p><small>Never gonna tell a lie and hurt you</small></p>
                </section>

                <section className="flex-col">
                    <p>Context.isAdmin: {`${Context.isAdmin}`}</p>

                    <button className="green" onClick={openModal}>Open Modal</button>
                    
                    <ButtonProfile
                        className="tp"
                        text={"Имя ок да"}
                        src={imgBasePhoto}
                    />

                    <ButtonProfile
                        text={"Имя ок нет"}
                        src={imgBasePhoto}
                    />

                    <ButtonProfile
                        src={imgBasePhoto}
                    />
                </section>

                <section className="flex-col">
                    <button>gray (default)</button>
                    <button className="green">green (confirm)</button>
                    <button className="red">red (cancel)</button>
                    <button className="tp">tp (transparent)</button>
                    <button disabled>disabled</button>
                    <Link to={"#"} className="text-link">Текст-ссылка по которой можно куда то попасть</Link>

                    <div className="flex-row">
                        <ButtonImage 
                            src={imgSearch}
                            alt="button-test"
                            text="Кнопка с текстом"
                        />
                        <ButtonImage 
                            src={imgPrivate}
                            alt="button-test"
                        />
                        <ButtonImage 
                            src={imgCopy}
                            alt="button-test"
                        />
                        <ButtonImage 
                            src={imgEdit}
                            alt="button-test"
                        />
                    </div>
                </section>

                <section className="flex-col">
                    <p style={{whiteSpace: "pre-wrap"}}>
                        {JSON.stringify(test, null, 4)}
                    </p>
                </section>
                    
                <section className="flex-col">
                    <CustomInput label="Пример с длинным название инпута">
                        <input ref={exampleInput} type="text" className={exampleInputError ?  "error" : null} required
                        onChange={() => {setExampleInputValue(exampleInput.current.value)}} />
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
                        onChange={() => {setExampleTextareaValue(exampleTextarea.current.value)}}></textarea>
                    </CustomInput>
                    <p>{"Текстареа: " + exampleTextareaValue}</p>
                </section>
            </article>
        </>
    )
}