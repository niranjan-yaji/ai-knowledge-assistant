const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");


// ===============================
// SEND MESSAGE
// ===============================

async function sendMessage() {

    const message = messageInput.value.trim();

    // Don't send empty messages
    if (message === "") {
        return;
    }


    // -------------------------------
    // Display user's message
    // -------------------------------

    const userMessage = document.createElement("div");

    userMessage.className = "message user-message";

    userMessage.innerHTML = `
        <strong>You:</strong>
        <div>${escapeHtml(message)}</div>
    `;

    chatBox.appendChild(userMessage);


    // Clear input box
    messageInput.value = "";


    // Scroll to bottom
    scrollToBottom();


    // Disable button while AI is responding
    sendButton.disabled = true;
    sendButton.textContent = "Thinking...";


    // -------------------------------
    // Show temporary loading message
    // -------------------------------

    const loadingMessage = document.createElement("div");

    loadingMessage.className = "message bot-message";

    loadingMessage.id = "loadingMessage";

    loadingMessage.innerHTML = `
        <strong>AI Bot:</strong>
        <div>Thinking...</div>
    `;

    chatBox.appendChild(loadingMessage);

    scrollToBottom();


    try {

        // -------------------------------
        // Send request to Flask
        // -------------------------------

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        // Try to read JSON response
        const data = await response.json();


        // -------------------------------
        // Remove loading message
        // -------------------------------

        const loading = document.getElementById("loadingMessage");

        if (loading) {
            loading.remove();
        }


        // -------------------------------
        // Check for server error
        // -------------------------------

        if (!response.ok) {

            throw new Error(
                data.error || "Server error occurred"
            );

        }


        // -------------------------------
        // Display AI response
        // -------------------------------

        const botMessage = document.createElement("div");

        botMessage.className = "message bot-message";

        botMessage.innerHTML = `
            <strong>AI Bot:</strong>
            <div>${formatResponse(data.reply)}</div>
        `;

        chatBox.appendChild(botMessage);

        scrollToBottom();


    } catch (error) {

        console.error("Chat error:", error);


        // Remove loading message if it still exists
        const loading = document.getElementById("loadingMessage");

        if (loading) {
            loading.remove();
        }


        // -------------------------------
        // Display error message
        // -------------------------------

        const errorMessage = document.createElement("div");

        errorMessage.className = "message bot-message";

        errorMessage.innerHTML = `
            <strong>AI Bot:</strong>
            <div>
                Sorry, something went wrong.
                Please try again.
            </div>
        `;

        chatBox.appendChild(errorMessage);

        scrollToBottom();

    }


    // -------------------------------
    // Enable button again
    // -------------------------------

    sendButton.disabled = false;

    sendButton.textContent = "Send";

    messageInput.focus();
}



// ===============================
// SEND WITH ENTER KEY
// ===============================

messageInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();

    }

});



// ===============================
// SEND BUTTON CLICK
// ===============================

sendButton.addEventListener("click", function() {

    sendMessage();

});



// ===============================
// SCROLL CHAT TO BOTTOM
// ===============================

function scrollToBottom() {

    chatBox.scrollTop = chatBox.scrollHeight;

}



// ===============================
// FORMAT AI RESPONSE
// ===============================

function formatResponse(text) {

    if (!text) {
        return "Sorry, I didn't receive a response.";
    }


    // Escape HTML first for security
    let safeText = escapeHtml(text);


    // Convert new lines to <br>
    safeText = safeText.replace(/\n/g, "<br>");


    return safeText;

}



// ===============================
// ESCAPE HTML
// Prevent HTML / JavaScript injection
// ===============================

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}



// ===============================
// INITIAL FOCUS
// ===============================

window.addEventListener("load", function() {

    messageInput.focus();

});
