import { useState, useContext } from "react"
import { DataContext } from "../Context"
import ButtonImage from "../ButtonImage/ButtonImage"
import imgClose from "../../assets/icons/Close.svg"

import "./Modal.css"

export default function Modal(props) {
    const Context = useContext(DataContext)

    function closeModal() {
        Context.setModalData({})
    }

    return (
        <>
            {Object.keys(props.children).length
                ? <div className={`modal__wrapper`} onClick={closeModal}>
                    <div className="modal__container flex-col" onClick={(event) => event.stopPropagation()}>
                        <ButtonImage 
                            id="modal__close-button"
                            src={imgClose}
                            alt="close-modal"
                            onClick={closeModal}
                        />

                        {props.children}
                    </div>
                  </div>
                : null
            }
        </>
    )
}