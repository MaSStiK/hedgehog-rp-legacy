import { VKsendRequest } from "../../assets/scripts/vk-api.js"
import { messages } from "./messages.js"
// words - 425201 messages


// Как только загрузиться сайт - ставим кнопку активной
$("#preload").addClass("hidden")
$("#load").removeClass("hidden")

// От имени юзера (сообщения Only)
const idkWhatIsThis = "dmsxLmEuOE9fcmVNT3Y5MHcxRHpsUHozajBDMThxQldQRlZBc1YtanhHekZSc2FfT2E4cGlHRUk2S1BaaWVfWks2X0dGQ0Y1b0xMWml0VG5aSEVxNXQ1YVo1djRERE9yTC03bkt0Z1BObXZ2WFZ3c0N0Um9vZEVYMkJpSk5PZjJYSGh5X0s1S3V2Q0RpZWstR091TmVueE94M2J5Nl9CR1lfaVM0SGplbUlHWHZqZmFfbFIzb2NaTUQ2cGlwV3YxNkxKX2lfQVBDWE1PMGRrLTV2NkhuOW5mTjZDdw=="

let resMessagesCount = 0

function VKloadMessages(offset) {
    VKsendRequest('messages.getHistory', {peer_id: 2000000922, count: 200, offset: offset, rev: 1},
    (data) => {
        let res = data.response

        // Как только res станет undefined, прекращаем грузить сообщения
        if (res !== undefined && res.items.length > 0) {
            $("#status").text(`Загрузка сообщений: Осталось ${res.count - offset} из ${res.count}`)

            console.log(`${res.count - offset} left`)

            for (let item of res.items) {
                // Откидываем пустые сообщения
                if (item.text !== "") {
                    if (messages[item.text] === undefined) {
                        messages[item.text] = {}
                    }

                    if (messages[item.text][item.from_id] === undefined) {
                        messages[item.text][item.from_id] = 1
                    } else {
                        messages[item.text][item.from_id] = messages[item.text][item.from_id] + 1
                    }
                }
            }

            VKloadMessages(offset + 200)
        } else {
            $("#status").text(`Загрузка сообщений: Осталось 0 из ${res.count}`)
            console.log("Loading ended");

            resMessagesCount = res.count
            sortMessages()
        }
    }, idkWhatIsThis) // Другой
}

let messagesCount = {}
let messagesCountSorted = []
let messagesCountSortedUsers = []

let words = {}
let wordsCount = {}
let wordsCountSorted = []

function sortMessages() {
    $("#status").text(`Загрузка: 0%`)
    console.log("messagesCount")

    for (let message of Object.keys(messages)) {
        if (messagesCount[message] === undefined) {
            messagesCount[message] = 0
        }

        for (let user of Object.keys(messages[message])) {
            messagesCount[message] += messages[message][user]
        }
    }

    
    $("#status").text(`Загрузка: 25%`)
    console.log("messagesCountSorted")

    // Сортировка сообщений
    messagesCountSorted = Object.entries(messagesCount).sort((a,b)=>b[1]-a[1])


    $("#status").text(`Загрузка: 50%`)
    console.log("messagesCountSortedUsers")

    // Добавляем колличество определенного сообщеий каждого юзера
    for (let messagePos in messagesCountSorted) {
        messagesCountSortedUsers.push([...messagesCountSorted[messagePos], messages[messagesCountSorted[messagePos][0]]])
    }


    $("#status").text(`Загрузка: 75%`)
    console.log("words")


    for (let message of messagesCountSortedUsers) {
        for (let word of message[0].replaceAll("\n", " ").split(" ")) {
            let wordLower = word.toLowerCase()
            if (words[wordLower] === undefined) {
                words[wordLower] = {}
            }

            for (let user of Object.keys(message[2])) {
                if (words[wordLower][user] === undefined) {
                    words[wordLower][user] = 0
                }

                words[wordLower][user] = words[wordLower][user] + message[2][user]
            }
        }
    }


    $("#status").text(`Загрузка: 100%`)
    console.log("wordsCount")


    // Сборка массива из слов и их общего колличества   
    for (let word of Object.keys(words)) {
        if (wordsCount[word] === undefined) {
            wordsCount[word] = 0
        }

        for (let user of Object.keys(words[word])) {
            wordsCount[word] += words[word][user]
        }
    }


    console.log("wordsCountSorted")

    // Сортировка слов
    wordsCountSorted = Object.entries(wordsCount).sort((a,b)=>b[1]-a[1])

    wordsCountSorted.splice(wordsCountSorted.findIndex(i => i[0] === ""), 1)

    $("#status").text(`Сообщений загружено: ${resMessagesCount} (Начиная с 19 августа 2020)
Уникальных сообщений: ${Object.keys(messagesCount).length}
Уникальных слов: ${Object.keys(wordsCount).length}`)

    $("#sort-buttons").removeClass("hidden")


    // Рендер по словам
    $("#by-words").on("click tap", () => {
        if (!$("#by-words").hasClass("primary")) {
            $("#by-messages").removeClass("primary")
            $("#by-words").addClass("primary")
            $("#words-container").html("")
            renderWords()
        }
    })


    // Рендер по сообщениям
    $("#by-messages").on("click tap", () => {
        if (!$("#by-messages").hasClass("primary")) {
            $("#by-words").removeClass("primary")
            $("#by-messages").addClass("primary")
            $("#words-container").html("")
            renderMessages()
        }
    })
}


// Рендер слов
function renderWords(offset=0) {
    for (let i = 0; i < offset + 1000; i++) {
        let text = wordsCountSorted[i]
        switch (text[0]) {
            case " ":
                text[0] = "*Пробел*"
                break;
            
            case "\n":
                text[0] = "*Перенос строки*"
                break;
        
            default:
                break;
       }
        $("#words-container").append(`<p class="block">${i + 1 + offset}) ${text[0].slice(0, 1).toUpperCase() + text[0].slice(1)}<span>(${text[1]} раз)</span></p>`)
    }

    // setTimeout(()=> {
    //     if (offset < 9900) {
    //         renderWords(offset + 100)
    //     }
    // }, 100)
}


// Рендер сообщений
function renderMessages(offset=0) {
    for (let i = 0; i < offset + 1000; i++) {
        let text = messagesCountSorted[i]
        switch (text[0]) {
             case " ":
                text[0] = "*Пробел*"
                break;
            
            case "\n":
                word[0] = "*Перенос строки*"
                break;
        
            default:
                break;
       }
        $("#words-container").append(`<p class="block">${i + 1 + offset}) ${text[0].slice(0, 1).toUpperCase() + text[0].slice(1)}<span>(${text[1]} раз)</span></p>`)
    }

    // setTimeout(()=> {
    //     if (offset < 9900) {
    //         renderWords(offset + 100)
    //     }
    // }, 100)
}


// Загрузка сообщений по нажатию
$("#load").on("click tap", () => {
    $("#load").remove()
    $("#status").removeClass("hidden")

    $("#status").text("Загрузка сообщений: ")
    VKloadMessages(425201)
})