from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get Gemini API key from environment
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set")

# Create Gemini client
client = genai.Client(api_key=api_key)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({
            "error": "Message cannot be empty"
        }), 400

    # Convert question to lowercase for checking
    question = user_message.lower()

    # -----------------------------------------
    # BOT CREATOR / OWNER / DEVELOPER QUESTIONS
    # -----------------------------------------

    existence_keywords = [
        "who built you",
        "who build you",
        "who created you",
        "who create you",
        "who developed you",
        "who develop you",
        "who made you",
        "who make you",
        "who is your developer",
        "who is your creator",
        "who is your owner",
        "who owns you",
        "who wrote your code",
        "who written your code",
        "who coded you",
        "who programmed you",
        "who created this bot",
        "who made this bot",
        "who developed this bot",
        "who built this bot",
        "who is the developer of this bot",
        "who is the creator of this bot",
        "who is the owner of this bot",
        "who is niranjan yaji"
    ]

    # Answer directly without using Gemini
    if any(keyword in question for keyword in existence_keywords):
        return jsonify({
            "reply": (
                "I was built and developed by Niranjan Yaji. "
                "Niranjan Yaji is my creator, developer, and owner."
            )
        })

    try:

        # Give Gemini instructions about the purpose of the bot
        prompt = f"""
You are an AI Knowledge Assistant.

Answer only general knowledge questions related to topics such as:
- Countries and capitals
- Geography
- Companies
- Technology
- Science
- Computers
- History
- Education
- General knowledge

If you know the answer, provide a clear and correct answer.

If the question is outside general knowledge, inappropriate, unclear,
or you genuinely do not know the answer, reply with exactly:

Sorry, I can't answer. Ask general knowledge questions only.

User question:
{user_message}
"""

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )

        reply = response.text.strip() if response.text else ""

        # If Gemini returns no answer
        if not reply:
            reply = "Sorry, I can't answer. Ask general knowledge questions only."

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        print("Gemini error:", e)

        return jsonify({
            "reply": "Sorry, I can't answer. Ask general knowledge questions only."
        }), 200


if __name__ == "__main__":
    app.run(debug=True)
