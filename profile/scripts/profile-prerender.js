import { getCache } from "../../assets/scripts/cache.js";
import { copyToClipboard, getUrlParams, linkTo } from "../../assets/scripts/global-functions.js";
import { notify } from "../../assets/scripts/notification/notification.js";


$("#profile-tag").on("click tap", () => {
    copyToClipboard($("#profile-tag").text())
    notify("Тег скопирован")
})