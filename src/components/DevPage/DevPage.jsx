import { useState, useEffect, useRef, useContext } from "react"
import { Link } from "react-router-dom"
import CustomInput from "../CustomInput/CustomInput"
import ButtonImage from "../ButtonImage/ButtonImage"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import { DataContext } from "../Context"
import { setPageTitle } from "../Global"
import imgProfileBase from "../../assets/replace/profile-base.png"
import imgHome from "../../assets/icons/Home.svg"
import imgTool from "../../assets/icons/Tool.svg"
import imgCopy from "../../assets/icons/Copy.svg"
import imgAt from "../../assets/icons/At.svg"

import $ from "jquery";


import "./DevPage.css"

export default function DevPage() {
    useEffect(() => {setPageTitle("dev")}, [])
    const Context = useContext(DataContext)

    function openModal() {
        Context.setModalData(
            <div style={{height: "var(--modal-height-max)", overflow: "auto", padding: "var(--gap-small)"}}>
                <p>{JSON.stringify(Context.userData, false, 4)}</p>
            </div>
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

    return (
        <article>
            <h4 className="page-title">h/dev</h4>

            <section className="flex-col">
                <h1>Never gonna give you up</h1>
                <h2>Never gonna let you down</h2>
                <h3>Never gonna run around and desert you</h3>
                <h4>Never gonna make you cry</h4>
                <p>Never gonna say goodbye</p>
                <p><small>Never gonna tell a lie and hurt you</small></p>

                {/* Отобразить userData из context */}
                <button className="green" onClick={openModal}>show userData</button>
            </section>

            <section className="flex-col">
                {/* Кнопка профиля */}
                <ButtonProfile
                    src={imgProfileBase}
                    text={"Имя участника"}
                    subText={"@тег"}
                />
                <button>gray (default)</button>
                <button className="green">green (confirm)</button>
                <button className="red">red (cancel)</button>
                <button className="tp">tp (transparent)</button>
                <button disabled>disabled</button>
                <Link to={"#"} className="text-link">Текст-ссылка по которой можно куда то попасть</Link>

                <div className="flex-row" style={{flexWrap: "wrap"}}>
                    <ButtonImage
                        src={imgHome}
                        alt="button-test"
                        text="Кнопка с текстом по центру"
                        width100
                    />
                    <ButtonImage
                        // src={imgHome}
                        alt="button-test"
                        text="Кнопка с текстом слева"
                        width100
                        atStart
                    />
                    <ButtonImage
                        src={imgTool}
                        alt="button-test"
                        className="green"
                    />
                    <ButtonImage
                        src={imgCopy}
                        alt="button-test"
                        className="red"
                    />
                </div>
            </section>

            {/* <section className="flex-col">
                <p style={{whiteSpace: "pre-wrap"}}>
                    {JSON.stringify({name: "name", array: [{a: 1, b: 2}, {a: 3, b: 4}]}, null, 4)}
                </p>
            </section> */}
                
            <section className="flex-col">
                <CustomInput label="Только читаемый инпут">
                    <input
                        type="text"
                        value={"Пример описания"}
                        readOnly
                        required
                    />
                </CustomInput>

                <CustomInput label="Пример с длинным название инпута" error={exampleInputError}>
                    <input
                        ref={exampleInput}
                        type="text"
                        onChange={() => {setExampleInputValue(exampleInput.current.value)}}
                        required
                    />
                </CustomInput>
                <p>{"Инпут: " + exampleInputValue}</p>
                <button disabled={disableErrorButton} onClick={handleErrorButton}>Сделать ошибку</button>

                <CustomInput label="Инпут с картинкой" error={exampleInputError} src={imgAt}>
                    <input
                        type="text"
                        required
                    />
                </CustomInput>
                
                <CustomInput label="Пример текстареа">
                    <textarea
                        ref={exampleTextarea}
                        required
                        onChange={() => {setExampleTextareaValue(exampleTextarea.current.value)}}
                    ></textarea>
                </CustomInput>
                <p>{"Текстареа: " + exampleTextareaValue}</p>
            </section>
        </article>
    )
}