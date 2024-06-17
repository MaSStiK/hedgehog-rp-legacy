import { useContext } from "react"
import { DataContext } from "../Context"
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
// https://github.com/BetterTyped/react-zoom-pan-pinch#readme

import ButtonImage from "../ButtonImage/ButtonImage"
import imgPlus from "../../assets/svg/Plus.svg"
import imgMinus from "../../assets/svg/Minus.svg"
import imgFullscreen from "../../assets/svg/Fullscreen.svg"

import "./Fullscreen.css"


const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls()
    return (
        <div className="fullscreen__controls flex-col">
            <ButtonImage
                src={imgPlus}
                alt="zoom-in"
                title="Приблизить картинку"
                onClick={() => zoomIn()}
            />
            <ButtonImage
                src={imgMinus}
                alt="zoom-out"
                title="Отдалить картинку"
                onClick={() => zoomOut()}
            />
            <ButtonImage
                src={imgFullscreen}
                alt="center"
                title="Центрировать картинку"
                onClick={() => resetTransform()}
            />
        </div>
    )
}

export default function Fullscreen({ children }) {
    const Context = useContext(DataContext)

    function openFullscreen() {
        Context.setModal(
            <div className="fullscreen">
                <TransformWrapper>
                    <Controls />
                    <TransformComponent>
                        <div className="fullscreen__image-wrapper">
                            <img src={children.props.src} alt="map" draggable="false" />
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        )
    }

    return (
        <div className="fullscreen-image" onClick={openFullscreen}>
            {children}
        </div>
    )
}
