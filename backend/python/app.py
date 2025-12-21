from flask import Flask, request, jsonify
from flask_cors import CORS

from summarizer import summarize_to_crt

app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)

@app.route("/summarize", methods=["POST", "OPTIONS"])
def summarize():
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    print("Summarization request received")

    try:
        data = request.get_json()
        transcript = data.get("transcript", "").strip()

        if not transcript:
            return jsonify({"error": "Transcript is empty"}), 400

        # ✅ YOUR CUSTOM SUMMARIZER
        summary = summarize_to_crt(transcript)

        return jsonify({"summary": summary}), 200

    except Exception as e:
        print("Error in summarize():", e)
        return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
