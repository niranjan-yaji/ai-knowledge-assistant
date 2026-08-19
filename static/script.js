// ========================================
// AI KNOWLEDGE ASSISTANT - CHAT JAVASCRIPT
// ========================================

// Get HTML elements
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");


// ========================================
// SEND MESSAGE
// ========================================

async function sendMessage() {

    const message = messageInput.value.trim();

    // Don't send empty messages
    if (message === "") {
        return;
    }


    // ------------------------------------
    // Display user's message
    // ------------------------------------

    const userMessage = document.createElement("div");

    userMessage.className = "message user-message";

    userMessage.innerHTML = `
        <strong>You:</strong>
        <div>${escapeHtml(message)}</div>
    `;

    chatBox.appendChild(userMessage);


    // Clear input
    messageInput.value = "";

    // Scroll to bottom
    scrollToBottom();


    // ------------------------------------
    // Disable send button
    // ------------------------------------

    sendButton.disabled = true;
    sendButton.textContent = "Thinking...";


    // ------------------------------------
    // Show loading message
    // ------------------------------------

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

        // ------------------------------------
        // Send request to Flask
        // ------------------------------------

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        // ------------------------------------
        // Read server response
        // ------------------------------------

        let data;

        try {

            data = await response.json();

        } catch (jsonError) {

            throw new Error("Invalid response from server");

        }


        // ------------------------------------
        // Remove loading message
        // ------------------------------------

        removeLoadingMessage();


        // ------------------------------------
        // Check server response
        // ------------------------------------

        if (!response.ok) {

            throw new Error(
                data.error || "Server error"
            );

        }


        // ------------------------------------
        // Check AI response
        // ------------------------------------

        if (!data.reply) {

            throw new Error(
                "AI did not return a response"
            );

        }


        // ------------------------------------
        // Display AI response
        // ------------------------------------

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


        // Remove loading message
        removeLoadingMessage();


        // ------------------------------------
        // Display friendly error
        // ------------------------------------

        const errorMessage = document.createElement("div");

        errorMessage.className = "message bot-message";

        errorMessage.innerHTML = `
            <strong>AI Bot:</strong>
            <div>
                I couldn't process that request right now.
                Please try again in a moment. 🙂
            </div>
        `;

        chatBox.appendChild(errorMessage);

        scrollToBottom();

    }


    // ------------------------------------
    // Enable button again
    // ------------------------------------

    sendButton.disabled = false;

    sendButton.textContent = "Send";

    messageInput.focus();

}



// ========================================
// REMOVE LOADING MESSAGE
// ========================================

function removeLoadingMessage() {

    const loadingMessage =
        document.getElementById("loadingMessage");

    if (loadingMessage) {
        loadingMessage.remove();
    }

}



// ========================================
// SEND USING ENTER KEY
// ========================================

messageInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        // Don't send while already processing
        if (!sendButton.disabled) {
            sendMessage();
        }

    }

});



// ========================================
// SEND BUTTON
// ========================================

sendButton.addEventListener("click", function() {

    if (!sendButton.disabled) {
        sendMessage();
    }

});



// ========================================
// SCROLL CHAT TO BOTTOM
// ========================================

function scrollToBottom() {

    chatBox.scrollTop = chatBox.scrollHeight;

}



// ========================================
// FORMAT AI RESPONSE
// ========================================

function formatResponse(text) {

    if (!text) {
        return "Sorry, I didn't receive a response.";
    }


    // Escape HTML for security
    let safeText = escapeHtml(text);


    // Convert new lines into HTML line breaks
    safeText = safeText.replace(/\n/g, "<br>");


    return safeText;

}



// ========================================
// ESCAPE HTML
// Prevent HTML / JavaScript injection
// ========================================

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}



// ========================================
// INITIAL PAGE LOAD
// ========================================

window.addEventListener("load", function() {

    messageInput.focus();

    scrollToBottom();

});
