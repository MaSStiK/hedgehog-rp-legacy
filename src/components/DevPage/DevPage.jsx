import { useState, useEffect, useRef, useContext } from "react"
import { Link } from "react-router-dom"
import { DataContext } from "../Context"
import { setPageTitle } from "../Global"
import { GSAPI } from "../API";
import CustomInput from "../CustomInput/CustomInput"
import ButtonProfile from "../ButtonProfile/ButtonProfile"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgCopy from "../../assets/svg/Copy.svg"
import imgHome from "../../assets/svg/Home.svg"
import imgTool from "../../assets/svg/Tool.svg"
import imgAt from "../../assets/svg/At.svg"
import imgProfileBase from "../../assets/replace/profile-base.png"

import "./DevPage.css"

export default function DevPage() {
    useEffect(() => {setPageTitle("dev")}, [])
    const Context = useContext(DataContext)

    // useEffect(() => {
    //     console.log("GETevent");
    //     GSAPI("GETevent", {}, (data) => {
    //         console.log(data);
    //     })
    // })

    function openModal(data) {
        Context.setModalData(
            <div style={{height: "var(--modal-height-max)", overflow: "auto", padding: "var(--gap-small)"}}>
                <p>{JSON.stringify(data, false, 4)}</p>
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
                <button className="green" onClick={() => openModal(Context.userData)}>userData</button>
                <button className="green" onClick={() => openModal(Context)}>Context</button>
            </section>

            <section className="flex-col">
                {/* Кнопки профиля */}
                <ButtonProfile
                    src={imgProfileBase}
                    text={"Имя участника"}
                    subText={"@тег"}
                />
                <ButtonProfile
                    text="Какой то текст типа lorem"
                    preview
                />

                {/* Кнопки с картинками */}
                <ButtonImage
                    src={imgTool}
                    alt="button-test"
                    text="gray (default)"
                />
                <ButtonImage
                    src={imgTool}
                    alt="button-test"
                    className="green"
                    text="green (confirm)"
                />
                <ButtonImage
                    src={imgTool}
                    alt="button-test"
                    className="red"
                    text="red (cancel)"
                />
                <ButtonImage
                    src={imgTool}
                    alt="button-test"
                    className="tp"
                    text="tp (transparent)"
                />
                <ButtonImage
                    src={imgTool}
                    alt="button-test"
                    text="disabled"
                    disabled={true}
                />

                {/* Кнопки в строку */}
                <div className="flex-row">
                    <ButtonImage
                        src={imgTool}
                        alt="button-test"
                    />
                    <ButtonImage
                        src={imgTool}
                        alt="button-test"
                        className="green"
                    />
                    <ButtonImage
                        src={imgTool}
                        alt="button-test"
                        className="red"
                    />
                    <ButtonImage
                        src={imgTool}
                        alt="button-test"
                        className="tp"
                    />
                    <ButtonImage
                        src={imgTool}
                        alt="button-test"
                        disabled={true}
                    />
                </div>

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
                </div>
                <Link to={"#"} className="text-link">Текст-ссылка по которой можно куда то попасть</Link>
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