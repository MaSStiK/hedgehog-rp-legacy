// Заполняем список пустыми юзерами

$(".countries-list").html("")

for (let i = 0; i < 5; i++) {
    $(".countries-list").append(`
        <div class="button-container">
            <a class="button-content" href="#">
                <img src="../assets/images/base/base-photo-empty.png" alt="vk-photo">
                <div class="button-names">
                    <p class="text-cut">&nbsp;</p>
                    <h5 class="text-cut text-secondary">&nbsp;</h5>
                </div>
            </a>
            <img class="button-favourite" src="../assets/images/icons/Favourite.svg" alt="favourite">
        </div>
    `)
}


// Поиск в списке всех участников
$("#countries-search").on("input", () => {
    if ($("#countries-search").val() === "") {
        $(".button-container").css("display", "flex")
    } else {
        $(".button-container").css("display", "none")
        $(".button-container").each((i, element) => { 
            // Если есть совпадение в поле имя или тег
            if ($(element).find(".js-country-name").text().toLowerCase().includes($("#countries-search").val().toLowerCase())) {
                $(element).css("display", "flex")
            }

            if ($(element).find(".js-country-tag").text().toLowerCase().includes($("#countries-search").val().toLowerCase())) {
                $(element).css("display", "flex")
            }
        })
    }
})