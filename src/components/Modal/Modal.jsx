import { useState, useContext } from "react"
import { DataContext } from "../Context"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgClose from "../../assets/icons/Close.svg"

import "./Modal.css"

export default function Modal({
    children,
    ...props
}) {
    const Context = useContext(DataContext)

    const [hoverCLoseModal, setHoverCloseModal] = useState();

    // Функция закрытия модального окна, срабатывает при нажатии на крестик или вне окна
    function closeModal(event) {
        if (event.target.className === "modal-wrapper") {
            Context.setModalData({})
        }
    }

    return (
        <>  
            {/* Отображаем модальное окно в случае если есть children */}
            {Object.keys(children).length !== 0 &&
                <div
                    className={`modal-wrapper`}
                    onClick={(event) => closeModal(event)}
                    // onMouseDown={(event) => closeModal(event)}
                >
                    <dialog className="modal" open>
                        {/* Контент модального окна */}
                        <div className="modal__content">
                            {children}
                        </div>

                        {/* Кнопка закрытия модального окна */}
                        <ButtonImage
                            id="modal__close-button"
                            src={imgClose}
                            alt="close-modal"
                            onClick={(closeModal)}
                        />
                    </dialog>
                  </div>
            }
        </>
    )
}