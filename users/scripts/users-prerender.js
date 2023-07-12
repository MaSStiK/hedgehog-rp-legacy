// Заполняем список пустыми юзерами

$(".users-list").html("")

for (let i = 0; i < 5; i++) {
    $(".users-list").append(`
    <div class="users-list__button-container">
        <a class="users-list__button" href="#">
            <img src="../assets/images/base/base-photo-empty.png" alt="vk-photo">
            <div class="users-list__button-names">
                <p class="text-cut">&nbsp;</p>
                <h5 class="text-cut text-secondary">&nbsp;</h5>
            </div>
        </a>
        <img class="users-list__favourite" src="../assets/images/icons/Favourite.svg" alt="favourite">
    </div>
    `)
}


// Поиск в списке всех участников
$("#users-search").on("input", () => {
    if ($("#users-search").val() === "") {
        $(".users-list__button-container").css("display", "flex")
    } else {
        $(".users-list__button-container").css("display", "none")
        $(".users-list__button-container").each((i, element) => { 
            // Если есть совпадение в поле имя или тег
            if ($(element).find(".js-user-name").text().toLowerCase().includes($("#users-search").val().toLowerCase())) {
                $(element).css("display", "flex")
            }

            if ($(element).find(".js-user-tag").text().toLowerCase().includes($("#users-search").val().toLowerCase())) {
                $(element).css("display", "flex")
            }
        })
    }
})