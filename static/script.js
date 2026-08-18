async function sendMessage() {

    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    // Show user message
    const userMessage = document.createElement("div");

    userMessage.className = "message user-message";

    userMessage.innerHTML = `
        <strong>You:</strong>
        <p>${message}</p>
    `;

    chatBox.appendChild(userMessage);

    input.value = "";

    // Show loading message
    const loadingMessage = document.createElement("div");

    loadingMessage.className = "message bot-message";

    loadingMessage.innerHTML = `
        <strong>AI Bot:</strong>
        <p>Thinking...</p>
    `;

    chatBox.appendChild(loadingMessage);

    chatBox.scrollTop = chatBox.scrollHeight;


    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        const data = await response.json();


        if (data.reply) {

            loadingMessage.innerHTML = `
                <strong>AI Bot:</strong>
                <p>${data.reply}</p>
            `;

        } else {

            loadingMessage.innerHTML = `
                <strong>AI Bot:</strong>
                <p>Sorry, something went wrong.</p>
            `;

        }

    } catch (error) {

        console.error(error);

        loadingMessage.innerHTML = `
            <strong>AI Bot:</strong>
            <p>Unable to connect to the server.</p>
        `;

    }

    chatBox.scrollTop = chatBox.scrollHeight;
}


// Press Enter to send
document.getElementById("user-input").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});
