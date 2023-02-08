export function setInputError(className) { // Ошибка в заполнении
    if (!$(className).hasClass("input-error")) {
        $(className).addClass("input-error")
    }
    setTimeout(() => {$(className).removeClass("input-error")}, 2000)
}

export function setBlockWaiting(className) { // Ожидание
    if (!$(className).hasClass("waiting")) {
        $(className).addClass("waiting")
    }
    setTimeout(() => {$(className).removeClass("waiting")}, 2000)
}

export function setButtonDisabled(className) {
    $(className).attr("disabled", "disabled")
    setTimeout(() => {$(className).removeAttr("disabled")}, 2000)
}

export function createNotification(text, color=null) {
    $("main").append(`<div class="modal-notification">${text}</div>`)
    if (color) {
        if (color === "primary") {
            $(".modal-notification").last().addClass("modal-notification-primary")
        }
        if (color === "danger") {
            $(".modal-notification").last().addClass("modal-notification-danger")
        }
    }
    setTimeout(() => {$(".modal-notification").first().remove()}, 3000)
}

$(window).on("offline", (event) => {
    createNotification("Потеряно интернет соединение", "danger")
})
$(window).on("online", (event) => {
    createNotification("Интернет соединение восстановлено", "primary")
})

// FireBase https://console.firebase.google.com/u/0/project/ejinoerp-a8d5c/database/ejinoerp-a8d5c-default-rtdb/data
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB17LQ4qvBFjCsKBG4736K5_aApSUJt9Uw",
  authDomain: "ejinoerp-a8d5c.firebaseapp.com",
  databaseURL: "https://ejinoerp-a8d5c-default-rtdb.firebaseio.com",
  projectId: "ejinoerp-a8d5c",
  storageBucket: "ejinoerp-a8d5c.appspot.com",
  messagingSenderId: "115569943731",
  appId: "1:115569943731:web:1a5e6a9e7c9c5c8acdbcc6",
  measurementId: "G-KS0M0ZBHFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import {getDatabase, ref, get, set, child, update, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const db = getDatabase()

export function deleteData(link, func=null) {
     // link = posts/
    remove(ref(db, link), data).then(() => {
        if (func) {func("removed")}
    }).catch((error) => {
        if (func) {func(error)}
    })
}


export function updateData(link, data, func=null) {
     // link = posts/
    update(ref(db, link), data).then(() => {
        if (func) {func("updated")}
    }).catch((error) => {
        if (func) {func(error)}
    })
}

export function getData(link, func=null) {
    // link = posts/
    get(child(ref(db), link)).then((data) => {
        if (func) {func(data.val())}
            
    }).catch((error) => {
        if (func) {func(error)}
    })
}

export function setData(link, data, func=null) {
    // link = posts/
    set(ref(db, link), data).then(() => {
        if (func) {func("set")}
    }).catch((error) => {
        if (func) {func(error)}
    })
}


// VK API
let token = "vk1.a.PfD30rLv8JpK3-RBjksczmShBSymiZ0gxlZn2FixH-B8OG-MA_GVSB-aOFlvydrzzyAYpPfs6Q8_fRUWJxapzjyHpcuzBynC2baY_fU0WkzgqC5yK1-tvY9fGEtBdnzZdOvFI1EPbst2XPt-yyR6JxTN7-T51bSaIhjNzcjPpWo1XD7DBhdAaJLBN1o0I36R31L0ORlG4wuLc1i4p2Jpaw"
function getMethodUrl(method, params) {
    if (!method) {
        console.log("Method not specified")
    } 
    params = params || {}
    params['access_token'] = token
    params['v'] = "5.131"
    return "https://api.vk.com/method/" + method + "?" + $.param(params)
}

export function sendVkRequest(method, params, func=null) {
    $.ajax({
        url: getMethodUrl(method, params),
        method: 'GET',
        dataType: 'JSONP',
        success: func,
    })
}