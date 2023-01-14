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