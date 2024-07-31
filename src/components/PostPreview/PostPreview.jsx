import ButtonProfile from "../ButtonProfile/ButtonProfile"

export default function PostPreview({
    noSection
}) {
    const postPreview = 
        <div className="flex-col post">
            <div className="flex-row post__top">
                <ButtonProfile
                    text="LoremLoremCountry"
                    className="tp"
                    noPadding
                    preview
                />
                <small className="text-gray">
                    <small className="text-preview">xx xxx • xx:xx</small>
                </small>
            </div>
            <h3 className="text-preview">Lorem ipsum dolor sit amet.</h3>
            <p>
                <span className="text-preview">Lorem ipsum dolor sit.</span>
                <br />
                <span className="text-preview">Lorem ipsum dolor, sit amet consectetur adipisicing.</span>
                <br />
                <span className="text-preview">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deserunt architecto explicabo eos. Ratione hic accusamus itaque assumenda magnam, labore odit, quae repellendus eveniet voluptas, nostrum optio alias voluptates quis!</span>
                <br />
                <span className="text-preview">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit officiis numquam sit esse eligendi adipisci, facere vero voluptates suscipit, earum aliquid molestiae, accusamus hic voluptate fugiat?</span>
                <br />
                <span className="text-preview">¿Cómo estás?</span>
            </p>
        </div>
    

    if (!noSection) { // Рендер внутри section
        return (
            <section className="flex-col post">
                {postPreview}
            </section>
        )
    } else { // Если передаем noSection - рендер в обычном div (без bg и border)
        return (
            <div className="flex-col post">
                {postPreview}
            </div>
        )
    }
}