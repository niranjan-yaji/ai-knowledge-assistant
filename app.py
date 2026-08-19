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

    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=user_message
        )

        return jsonify({
            "reply": response.text
        })

    except Exception as e:

        print("Gemini error:", e)

        return jsonify({
            "error": "Sorry, I couldn't process your request."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
