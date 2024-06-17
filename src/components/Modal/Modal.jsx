import { useContext } from "react"
import { DataContext } from "../Context"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgCross from "../../assets/svg/Cross.svg"

import "./Modal.css"

export default function Modal({ children }) {
    const Context = useContext(DataContext)

    // Функция закрытия модального окна, срабатывает при нажатии на крестик или вне окна
    function closeModal() {
        Context.setModal({})
    }

    return (
        <>  
            {/* Отображаем модальное окно в случае если есть children */}
            {Object.keys(children).length !== 0 &&
                <div
                    className={`modal-wrapper`}
                    onMouseDown={(event) => {
                        if (event.target.className === "modal-wrapper") {
                            closeModal()
                        }
                    }}
                >
                    <dialog className="modal" open>
                        {/* Контент модального окна */}
                        {children}

                        {/* Кнопка закрытия модального окна */}
                        <ButtonImage
                            id="modal__close-button"
                            src={imgCross}
                            alt="close-modal"
                            title="Закрыть окно"
                            onClick={(closeModal)}
                        />
                    </dialog>
                  </div>
            }
        </>
    )
}