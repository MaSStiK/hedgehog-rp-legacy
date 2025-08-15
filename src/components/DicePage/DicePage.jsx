import { useState, useEffect, useRef, useContext } from "react"
import { DataContext } from "../Context"
import ButtonImage from "../ButtonImage/ButtonImage"
import CustomSelect from "../CustomSelect/CustomSelect";
import CustomInput from "../CustomInput/CustomInput"
import DiceRange from "./DiceRange"
import DiceRoll from "./DiceRoll"
import { CONFIG, setPageTitle } from "../Global"
import $ from "jquery";
import imgDice from "../../assets/tools/Dice.svg"

import "./DicePage.css"
import "./DicePage-phone.css"

export default function DicePage() {
    useEffect(() => {setPageTitle("Игральная кость")}, [])
    const Context = useContext(DataContext)

    const [errorText, setErrorText] = useState("")
    const [inputError, setInputError] = useState()

    const inputRef = useRef()

    function handleInputUpdate() {
        setErrorText("")
        setInputError()
    }

    // Выбор игральной кости
    const diceTypeOptions = [
        {value: "d100", label: "D100", faces: 100},
        {value: "d20", label: "D20 (По умолчанию)", faces: 20},
        {value: "d10", label: "D10", faces: 10},
        {value: "d6", label: "D6", faces: 6},
    ]
    const [DiceType, setDiceType] = useState(diceTypeOptions[1])
    const [DiceAdditionalValue, setDiceAdditionalValue] = useState([0])

    // Выбор отправлять результат или нет
    const diceSendOptions = [
        {value: "true", label: "Отправить в беседу"},
        {value: "false", label: "Не отправлять"},
    ]
    const [DiceResultSend, setDiceResultSend] = useState(diceSendOptions[0])

    const [showResult, setShowResult] = useState(false)
    const [resultData, setResultData] = useState(false)
    async function handleDiceRoll() {
        try {
            const data = await DiceRoll(
                Context,
                inputRef.current.value,
                DiceType,
                DiceAdditionalValue, // Дополнительное значения шанса
                DiceResultSend
            )

            setShowResult(true)
            setResultData(data)

            if (data.messageSended) {
                startTimer(30)
                localStorage.diceCooldown = Date.now()
            }
        } catch (error) {
            setErrorText(error.text)
            setInputError(error.input)
        }
    }

    function startTimer(timer) {
        $(".dice__timer-span").text(timer) // Ставим начальный таймер в 30 секунд
        $(".dice__timer").addClass("show-timer")

        let intervalId = setInterval(() => {
            $(".dice__timer-span").text(--timer)

            if (timer <= 0) {
                $(".dice__timer").removeClass("show-timer")
                clearInterval(intervalId)
                delete localStorage.diceCooldown
            }
        }, 1000)
    }

    useEffect(() => {
        if (localStorage.diceCooldown) {
            startTimer(30 - Math.round((Date.now() - localStorage.diceCooldown) / 1000)) // Вычитаем из 30 секунд прошедшее время
        }
    }, [])
    
    return (
        <article>
            <h4 className="page-title">h/tools/dice</h4>

            <section className="flex-col">
                <h1>Игральная кость</h1>
                <h4 className="text-light">Узнайте вероятность исхода различных событий с помощью интерактивной игральной кости</h4>

                <CustomInput label="Событие" error={inputError === "event"}>
                    <input
                        ref={inputRef}
                        type="text"
                        id="form-event"
                        maxLength={CONFIG.DICE_TEXT_MAX}
                        onInput={handleInputUpdate}
                        required
                    />
                </CustomInput>
                <small className="text-gray">(Не обязательно)
                    <br />• Длина до {CONFIG.DICE_TEXT_MAX} символов
                </small>

                <p>Тип игральной кости (кол-во граней)</p>
                <CustomSelect
                    options={diceTypeOptions}
                    values={diceTypeOptions[
                        diceTypeOptions.findIndex(option => option.value === DiceType.value) >= 0
                        ? diceTypeOptions.findIndex(option => option.value === DiceType.value)
                        : 0
                    ]} // Значение по умолчанию
                    onChange={value => setDiceType(value[0])}
                />

                {DiceType.value === "d20" &&
                    <div className="dice__luck flex-row">
                        <p>Изменить удачу</p>
                        <div className="dice__luck-wrapper">
                            <DiceRange
                                state={DiceAdditionalValue}
                                setState={setDiceAdditionalValue}
                            />
                        </div>
                    </div>
                }

                <p>Отправлять результаты броска</p>
                <CustomSelect
                    options={diceSendOptions}
                    values={diceSendOptions[
                        diceSendOptions.findIndex(option => option.value === DiceResultSend.value) >= 0
                        ? diceSendOptions.findIndex(option => option.value === DiceResultSend.value)
                        : 0
                    ]} // Значение по умолчанию
                    onChange={value => setDiceResultSend(value[0])}
                />

                <p className="dice__timer">Через <span className="dice__timer-span"></span> секунд можно будет снова отправить результаты в беседу. Пока время идет, можете кидать кости на сайте без ограничений.</p>

                {errorText &&
                    <p className="text-red" style={{textAlign: "center"}}>{errorText}</p>
                }

                <ButtonImage
                    src={imgDice}
                    alt="roll-the-dice"
                    text="Бросить кость"
                    title="Испытать удачу"
                    width100
                    onClick={handleDiceRoll}
                />

                {showResult &&
                    <p className="text-light">Вы бросаете игральную кость д{DiceType.faces}
                        <br />Вам выпадает грань с числом: {resultData.result}
                        {(DiceType.value === "d20" && resultData.resultAdditional !== undefined) &&
                            <>
                                <br />{`Но удача (${resultData.additionalValue > 0 ? `+${resultData.additionalValue}` : resultData.additionalValue}) меняет грань на: ${resultData.resultAdditional}`}
                            </>
                        }
                    </p>
                }
            </section>
        </article>
    )
}