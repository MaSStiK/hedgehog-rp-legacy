function renderMessages(messages) {
    document.querySelector(".messages-container").innerHTML = ''
    document.querySelector(".form__send-button").disabled = false

    messages.forEach(element => {
        let messagesContainer = document.querySelector(".messages-container")
        let message = document.createElement("div")
        message.classList.add("message")

        let messageName = document.createElement("div")
        messageName.classList.add("message-name")
        messageName.textContent = element.message.name

        let messageText = document.createElement("div")
        messageText.classList.add("message-text")
        messageText.textContent = element.message.text

        let messageTime = document.createElement("div")
        messageTime.classList.add("message-time")
        messageTime.textContent = element.message.date;

        message.append(messageTime)
        message.append(messageName)
        message.append(messageText)

        messagesContainer.append(message)
    })
}

function getMessagesBin() {
    const apiKey = "$2b$10$tGZ7W.rsX/0hu8Y5G.dZwuBPkrpHj/Fb8FLg96MVU8wvDwRH9MKT."
    const binKey = "63b70b7015ab31599e2df2a0"
    
}

function sendMessagesBin(name, text, date) {
    const apiKey = "$2b$10$tGZ7W.rsX/0hu8Y5G.dZwuBPkrpHj/Fb8FLg96MVU8wvDwRH9MKT."
    const binKey = "63b70b7015ab31599e2df2a0"
    // Получаем bin 
    let reqGet = new XMLHttpRequest();

    reqGet.onreadystatechange = () => {
        if (reqGet.readyState == XMLHttpRequest.DONE) {
            // Отправляем новый bim
            let reqPut = new XMLHttpRequest();

            reqPut.onreadystatechange = () => {
                if (reqPut.readyState == XMLHttpRequest.DONE) {
                    // Bin отправился и рендерим все новые сообщения
                    renderMessages(JSON.parse(reqPut.responseText).record.messages)
                }
            };

            reqPut.open("PUT", `https://api.jsonbin.io/v3/b/${binKey}`, true);
            reqPut.setRequestHeader("Content-Type", "application/json");
            reqPut.setRequestHeader("X-Master-Key", apiKey);
            
            let allMessages = JSON.parse(reqGet.responseText).record
            let newMessage = {message: {
                name: name,
                text: text,
                date: date
            }}
            allMessages.messages.unshift(newMessage)
            reqPut.send(JSON.stringify(allMessages));
        }
    };

    reqGet.open("GET", `https://api.jsonbin.io/v3/b/${binKey}/latest`, true);
    reqGet.setRequestHeader("X-Master-Key", apiKey);
    reqGet.send();
}

function updateMessagesBin() {
    const apiKey = "$2b$10$tGZ7W.rsX/0hu8Y5G.dZwuBPkrpHj/Fb8FLg96MVU8wvDwRH9MKT."
    const binKey = "63b70b7015ab31599e2df2a0"
    // Получаем bin 
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            renderMessages(JSON.parse(req.responseText).record.messages)
        };
    }

    req.open("GET", `https://api.jsonbin.io/v3/b/${binKey}/latest`, true);
    req.setRequestHeader("X-Master-Key", apiKey);
    req.send();
}

document.querySelector(".form__send-button").onclick = () => {
    document.querySelector(".form__send-button").disabled = true
    date = new Date().toLocaleString('ru', {timeZone: 'Europe/Moscow'})
    let name = document.querySelector(".form__input-name").value
    let text = document.querySelector(".form__input-text").value

    name = name === "" ? "Anonymous" : name
    text = text === "" ? "Промолчал" : text
    sendMessagesBin(name, text, date)
}

setInterval(() => {
    updateMessagesBin()
}, 5000)
