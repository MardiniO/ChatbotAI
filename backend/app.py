from flask import Flask, request, jsonify
from flask_cors import CORS
from chatBot import chatBot
from crudOperations import (
    readQuesData,
    updateQuesData,
    deleteQuesData,
    addQuesToDatabase,
    readUserData,
    addUserToDatabase,
    deleteUserData,
    updateUserData,
)

app = Flask(__name__)
CORS(app)

# Functions are presented in order of use.


# Function that receives input from user in ChatbotUI then sends response back.
@app.route("/receive", methods=["POST"])
def receive_data():
    try:
        data = request.json
        received_string = data.get("data")
        response_message = chatBot(received_string)
        return jsonify({"received": response_message})
    except Exception as e:
        return jsonify(error=str(e)), 500


# Function responsible for signing in to admin page.
@app.route("/sign-in", methods=["POST"])
def sign_in():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return jsonify({"error": "Missing username or password"}), 400
        ids, users, passwords = readUserData()
        if username in users and passwords[users.index(username)] == password:
            return jsonify({"message": "Sign-in successful"})
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify(error=str(e)), 500


# Function responsible for fetching all questions from database, used in chatbotModal and in admin page.
@app.route("/fetch-questions", methods=["GET"])
def fetch_questions():
    try:
        ids, questions, answers = readQuesData()
        if not questions or not answers:
            return jsonify(error="No questions or answers found"), 404
        data = [
            {"id": ids[i], "question": questions[i], "answer": answers[i]}
            for i in range(len(questions))
        ]
        return jsonify(data=data)
    except Exception as e:
        return jsonify(error=str(e)), 500


# Function responsible for fetching all usernames and password from database, used in admin page.
@app.route("/fetch-users", methods=["GET"])
def fetch_users():
    try:
        ids, users, passwords = readUserData()
        if not users or not passwords:
            return jsonify(error="No users or passwords found"), 404
        data = [
            {"id": ids[i], "username": users[i], "password": passwords[i]}
            for i in range(len(users))
        ]
        return jsonify(data=data)
    except Exception as e:
        return jsonify(error=str(e)), 500


# Function responsible for updating questions and answers in database.
@app.route("/update-question/<int:id>", methods=["PUT"])
def update_question(id):
    try:
        data = request.json
        question = data.get("question")
        answer = data.get("answer")

        if not question or not answer:
            return jsonify({"error": "Missing question or answer"}), 400

        updateQuesData(id, question, answer)
        return jsonify({"message": "Question updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Function responsible for updating usernames and passwords in database.
@app.route("/update-user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Missing username or password"}), 400

        ids, _, _ = readUserData()

        # Logic to update the user in your database
        if user_id in ids:
            updateUserData(user_id, username, password)
            return jsonify({"message": "User updated successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Function responsible for deleting question in database.
@app.route("/delete-questions/<int:id>", methods=["DELETE"])
def delete_question(id):
    try:
        deleteQuesData(id)
        return jsonify({"message": "Question deleted successfully"})
    except Exception as e:
        return jsonify(error=str(e)), 500


# Function responsible for deleting usernames and passwords in database.
@app.route("/delete-users/<int:id>", methods=["DELETE"])
def delete_user(id):
    try:
        ids, _, _ = readUserData()
        if id in ids:
            deleteUserData(id)
            return jsonify({"message": "User deleted successfully"})
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route("/add-question", methods=["POST"])
def add_question():
    try:
        data = request.json
        question = data.get("question")
        answer = data.get("answer")

        if not question or not answer:
            return jsonify({"error": "Missing question or answer"}), 400

        addQuesToDatabase(question, answer)
        return jsonify({"message": "Question added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/add-user", methods=["POST"])
def add_user():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Missing username or password"}), 400

        ids, usernames, passwords = readUserData()

        if username not in usernames:
            addUserToDatabase(username, password)
            return jsonify({"message": "User added successfully"})
        else:
            return jsonify({"error": "User already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
