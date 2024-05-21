import { useState, useRef, useEffect } from "react"
import ButtonImage from "../ButtonImage/ButtonImage"
import ImageFullscreen from "../ImageFullscreen/ImageFullscreen"

import imgReviewStar from "../../assets/images/review-star.png"
import imgArrowLeft from "../../assets/icons/Arrow-left.svg"
import imgArrowRight from "../../assets/icons/Arrow-right.svg"

export default function AboutReviews() {
    const [reviewsCounter, setReviewsCounter] = useState(1) // Счетчик отзывов
    const [reviewsWidth, setReviewsWidth] = useState(0) // Ширина отзыва (Во всю ширину)
    const reviewContainer = useRef()

    function resizeAttach() { // Установка ширины картинки
        setReviewsWidth(reviewContainer.current ? reviewContainer.current.offsetWidth : 0)
    }
    window.addEventListener("resize", (resizeAttach)) // Обновляем ширину картинки при изменении ширины браузера
    useEffect(resizeAttach, [reviewContainer]) // Устанавливаем ширину картинки как только контейнер с картинками доступен
    
    function sliderPrev() { // Предыдущий элемент
        // Если первый элемент - ставим последний
        setReviewsCounter(reviewsCounter === 1 ? reviews.length : reviewsCounter - 1)
    }

    function sliderNext() { // Следующий элемент
        // Если последний элемент - ставим первый
        setReviewsCounter(reviewsCounter === reviews.length ? 1 : reviewsCounter + 1)
    }


    const reviews = [
        {
            photo: "https://psv4.userapi.com/c909518/u291195777/docs/d35/a85efc2c98ea/sticker.gif?extra=Hs-VW0LAPfAGJ2m3PxHWX0tBmtaSSZEGbNnoPzRIWAMkg7-k5bzMJ577FFZqVGnN7vwAaYM0RwvfTQ2kt7kXeOPeoW6N6_SkEhgdWT61Peakp08vvwNdnUR6v_KKzEnBAjnfKuYSw0NqXbP3MLwI2zAk",
            name: "Алексей Шевцов",
            text: `Есть только черный и зеленый.\nВсе остальное - оттенки.\n\n"Ежиное РП" - один из лучших проектов. Он уступает лишь нашему магазину вещей JolyBELL. Доставки есть во все страны, в которых есть McDonald’s.`
        },
        {
            photo: "https://media.tenor.com/O4NpEw8ohA0AAAAM/miranda-cosgrove-i-carly.gif",
            name: "Карли Шей",
            text: `"Ежиное РП" это лучшее, что придумало человечество (после iCarly).\n\nЕсли бы ежи могли бы делать спаггети тако, цены бы им не было. А им и так нет. Мнение человека слева  и справа - база. Слава Сиэтльской Республике Кулсториробоба.`
        },
        {
            photo: "https://psv4.userapi.com/c237131/u383610339/docs/d25/7ed846b096c7/papich-arthas.gif?extra=9VmAdKxWc8lI8mdELGvpMZtttXW4yaTHDMUmAQ7eD92p4y1QGreQZGuMWORgCZxkJQb_fAbjr6UTZzM1uSRgI9CcT9TM3iKgwOO-Js9UclVjlDPOo4lg7gg_hQAaaDMRefqXMMk2rntRyuq4Shv7BEFi",
            name: "Виталий Папич",
            text: `Когда меня добавили в беседу и я создал свою страну, первыми моими словами были:\n"О, найс, я щас убью всех, бл**ь."\nЭто хороший проект, который мне очень понравился. Да здравствует Дото-Винницкая Республика! Слава Єжинiï!.`
        },
    ]

    return (
        <section className="flex-col">
            <h2>Нас рекомендуют</h2>
            <div className="reviews-wrapper" ref={reviewContainer}>
                <div className="reviews-container" style={{left: `${-reviewsWidth * (reviewsCounter - 1)}px`}}>

                    {/* Рендер отзывов */}
                    {reviews.map((review, i) => (
                        <div className="review" key={i}>
                            <div className="flex-col review__content" style={{width: reviewsWidth}}>
                                <div className="review__photo">
                                    <ImageFullscreen>
                                        <img src={review.photo} alt="review" draggable="false"/>
                                    </ImageFullscreen>
                                </div>
                                <h3 className="review__name">{review.name}</h3>
                                <div className="flex-row review__stars">
                                    <img src={imgReviewStar} alt="star" draggable="false"/>
                                    <img src={imgReviewStar} alt="star" draggable="false"/>
                                    <img src={imgReviewStar} alt="star" draggable="false"/>
                                    <img src={imgReviewStar} alt="star" draggable="false"/>
                                    <img src={imgReviewStar} alt="star" draggable="false"/>
                                </div>
                                <p className="review__text">{review.text}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <div className="flex-row reviews-control">
                <ButtonImage
                    src={imgArrowLeft}
                    alt="image-prev"
                    onClick={sliderPrev}
                />
                <p><span>{reviewsCounter}</span> из <span>{reviews.length}</span></p>
                <ButtonImage
                    src={imgArrowRight}
                    alt="image-next"
                    onClick={sliderNext}
                />
            </div>
        </section>
    )
}
