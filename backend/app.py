from flask import Flask, request, jsonify
from flask_cors import CORS
from chatBot import chatBot
from crudOperations import readVariablesFromTable
import hashlib

app = Flask(__name__)
# CORS, or Cross Origin Resource Sharing, is responsible for providing
# ability to send data from backend to frontend, and vice versa.
CORS(app)


# Route to receive data from the frontend
@app.route("/receive", methods=["POST"])
def receive_data():
    try:
        data = request.json  # Getting the data from frontend
        # Extracting the string from the JSON data using the 'data' key
        received_string = data.get("data")

        # Sending response fromt chatBot.py to frontend in JSON format using jsonify.
        response_message = chatBot(received_string)
        return jsonify({"received": response_message})
    except Exception as e:
        return jsonify(error=str(e)), 500  # Return error message and status code


# Route to fetch all questions and answers from the database
@app.route("/fetch-questions", methods=["GET"])
def fetch_questions():
    try:
        # Using readVariablesFromTable() in order to obtain a list of all ids, questions, and answers.
        # ids are placed in a temp list since they are not needed in this case.
        _, questions, answers = readVariablesFromTable()

        # If no data is found, return so.
        if not questions or not answers:
            return jsonify(error="No questions or answers found"), 404

        # Formats the data of the JSON in format of ("question" : "...", "answer" : "...")
        data = [
            {"question": questions[i], "answer": answers[i]}
            for i in range(len(questions))
        ]
        return jsonify(data=data)  # Return data as JSON array of objects

    except Exception as e:
        return jsonify(error=str(e)), 500  # Return error message and status code

    # Dummy data for demonstration. Replace with database calls in production.


users_db = {
    "user1": hashlib.sha256("password1".encode()).hexdigest(),
    "user2": hashlib.sha256("password2".encode()).hexdigest(),
}


@app.route("/sign-in", methods=["POST"])
def sign_in():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Missing username or password"}), 400

        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        if username in users_db and users_db[username] == hashed_password:
            return jsonify({"message": "Sign-in successful"})
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify(error=str(e)), 500


if __name__ == "__main__":
    app.run(debug=True)
