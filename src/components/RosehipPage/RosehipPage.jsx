import { useState, useEffect, useRef } from "react"
import ButtonImage from "../ButtonImage/ButtonImage"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"
import { GSAPI } from "../API"
import { setPageTitle } from "../Global"
import imgArrowDown from "../../assets/svg/Arrow-down.svg"
import imgArrowUp from "../../assets/svg/Arrow-up.svg"
import imgClassified from "../../assets/images/Tools/classified.png"

import "./RosehipPage.css"
import "./RosehipPage-phone.css"

export default function RosehipPage() {
    useEffect(() => {setPageTitle("Шиповник")}, [])
    
    const [rosehipData, setRosehipData] = useState(sessionStorage.rosehip ? JSON.parse(sessionStorage.rosehip) : []);
    const [showPreload, setShowPreload] = useState(true); // Прелоад

    useEffect(() => {
        GSAPI("GETrosehip", {}, (data) => {
            console.log("GSAPI: GETrosehip");
            setShowPreload(false)
            data = data.reverse()
    
            setRosehipData(data) // Отправляем данные в массив для рендера
            sessionStorage.rosehip = JSON.stringify(data) // Сохраняем их локально
        })
    }, [])
    

    return (
        <article>
            <h4 className="page-title">h/tools/rosehip</h4>

            <section className="flex-col">
                <h1>Шиповник <small className="text-gray">(feat. Даня)</small></h1>
                <h3>Данный список представляет собой сведения о существах, представляющих угрозу существования Кулсториробоба и его жителям</h3>
            </section>

            {showPreload && 
                <section>
                    {rosehipData.length
                        ? <p>Загрузка обновленных данных</p>
                        : <p>Идет загрузка секретных данных, пожалуйста, подождите</p>
                    }
                </section>
            }

            {rosehipData.length !== 0 &&
                <>
                    {rosehipData.map((dossier, i) => <RenderDossier dossier={dossier} key={i}/>)}
                </>
            }
        </article>
    )
}


function RenderDossier({dossier}) {
    const [openDossier, setOpenDossier] = useState(false);

    return (
        <section className="flex-col">
            <div className="flex-row">
                <div className="dossier__photo">
                    <ImageFullscreen>
                        {dossier.photo
                            ? <img src={dossier.photo} alt="dossier" draggable="false" className="dossier__photo_border" />
                            : <img src={imgClassified} alt="dossier" draggable="false" />
                        }
                    </ImageFullscreen>
                </div>
                <div className="flex-col dossier__info">
                    {dossier.name && <h3>{dossier.name}</h3>}
                    {dossier.date && <p>Дата рождения: {dossier.date}</p>}
                    {dossier.city && <p>Город: {dossier.city}</p>}
                    {dossier.danger && <p>{dossier.danger}</p>}
                    {dossier.eliminated && <p className="text-red strong">Ликвидирован: {dossier.eliminated}</p>}
                </div>
            </div>

            {/* Если есть досье - показываем блок с возможностью его отобразить */}
            {dossier.dossier && 
                <>
                    {openDossier &&
                        <div className="dossier__dossier" dangerouslySetInnerHTML={{ __html: dossier.dossier }} />
                    }

                    <ButtonImage
                        src={openDossier ? imgArrowUp : imgArrowDown}
                        text={openDossier ? "Свернуть полное досье" : "Раскрыть полное досье"}
                        onClick={() => setOpenDossier(!openDossier)}
                    />
                </>
            }
            
        </section>
    )
}