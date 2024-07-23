from flask import Flask, request, jsonify
from flask_cors import CORS
from chatBot import chatBot
from crudOperations import (
    readVariablesFromTable,
    updateData,
    deleteData,
    addToDatabase,  # Assuming you have this function to add data
)
import hashlib

app = Flask(__name__)
CORS(app)

users_db = {
    "user1": hashlib.sha256("password1".encode()).hexdigest(),
    "user2": hashlib.sha256("password2".encode()).hexdigest(),
}


@app.route("/receive", methods=["POST"])
def receive_data():
    try:
        data = request.json
        received_string = data.get("data")
        response_message = chatBot(received_string)
        return jsonify({"received": response_message})
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route("/fetch-questions", methods=["GET"])
def fetch_questions():
    try:
        ids, questions, answers = readVariablesFromTable()
        if not questions or not answers:
            return jsonify(error="No questions or answers found"), 404
        data = [
            {"id": ids[i], "question": questions[i], "answer": answers[i]}
            for i in range(len(questions))
        ]
        return jsonify(data=data)
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route("/update-question/<int:id>", methods=["PUT"])
def update_question(id):
    try:
        data = request.json
        question = data.get("question")
        answer = data.get("answer")

        if not question or not answer:
            return jsonify({"error": "Missing question or answer"}), 400

        updateData(id, question, answer)
        return jsonify({"message": "Question updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/delete-questions/<int:id>", methods=["DELETE"])
def delete_question(id):
    try:
        deleteData(id)
        return jsonify({"message": "Question deleted successfully"})
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route("/fetch-users", methods=["GET"])
def fetch_users():
    try:
        data = [
            {"username": username, "password": password}
            for username, password in users_db.items()
        ]
        return jsonify(data=data)
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route("/update-user/<string:username>", methods=["PUT"])
def update_user(username):
    try:
        data = request.json
        new_username = data.get("username")
        password = data.get("password")

        if not new_username or not password:
            return jsonify({"error": "Missing username or password"}), 400

        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        if username in users_db:
            del users_db[username]
            users_db[new_username] = hashed_password
            return jsonify({"message": "User updated successfully"})
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/delete-users/<string:username>", methods=["DELETE"])
def delete_user(username):
    try:
        if username in users_db:
            del users_db[username]
            return jsonify({"message": "User deleted successfully"})
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route("/add", methods=["POST"])
def add_entry():
    try:
        data = request.json
        if "question" in data and "answer" in data:
            question = data["question"]
            answer = data["answer"]
            addToDatabase(
                question, answer
            )  # Assuming you have a function to add data to the DB
            return jsonify({"message": "Question added successfully"})
        elif "username" in data and "password" in data:
            username = data["username"]
            password = hashlib.sha256(data["password"].encode()).hexdigest()
            if username not in users_db:
                users_db[username] = password
                return jsonify({"message": "User added successfully"})
            else:
                return jsonify({"error": "User already exists"}), 400
        else:
            return jsonify({"error": "Invalid data"}), 400
    except Exception as e:
        return jsonify(error=str(e)), 500


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
