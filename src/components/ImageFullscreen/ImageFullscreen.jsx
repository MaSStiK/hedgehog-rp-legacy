import { useContext } from "react"
import { DataContext } from "../Context"
import { MapInteractionCSS } from "react-map-interaction";
// https://blog.logrocket.com/adding-zoom-pan-pinch-react-web-apps/

import "./ImageFullscreen.css"

export default function ImageFullscreen({
    children,
    ...props
}) {
    const Context = useContext(DataContext)

    function openFullscreen() {
        Context.setModalData(
            <div className="image-fullscreen__modal">
                <MapInteractionCSS
                    defaultValue={{
                        scale: 1,
                        translation: {
                            x: 0,
                            y: 0
                        }
                    }}
                    minScale={0.5}
                    maxScale={5}
                >
                    <div className="image-fullscreen__modal-wrapper">
                        <img src={children.props.src} alt="fullscreen" draggable="false" />
                    </div>
                </MapInteractionCSS>
            </div>
        )
    }

    return (
        <div className="image-fullscreen" onClick={openFullscreen}>
            {children}
        </div>
    )
}
