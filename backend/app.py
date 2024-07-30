from flask import Flask, request, jsonify

import pandas as pd
from flask import send_file
from io import BytesIO

# Cross-Origin Resource Sharing
from flask_cors import CORS

# Flask Token Authentication
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
)
from datetime import timedelta

# from chatBot import chatBot
from crudOperations import (
    addData,
    readData,
    updateData,
    deleteData,
    clearData,
)
import cohere
from apiKey import apiKey  # Separate file so API key is not shared

# Password encryption
from flask_bcrypt import bcrypt

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    minutes=30
)  ## Sets expiry time for token, in this case 10 minutes.
co = cohere.Client(apiKey)

jwt = JWTManager(app)
CORS(app)


# Functions are presented in order of use.


### Chatbot ###


# Function that receives input from user in ChatbotUI then sends response back.
@app.route("/receive", methods=["POST"])
def receive_data():
    try:
        data = request.json
        received_string = data.get("data")
        response_message = co.chat(message=received_string)
        return jsonify({"received": response_message.text})
    except Exception as e:
        return jsonify(error=str(e)), 500


###


### Sign-in + Admin CRUD Functions ###


# Function responsible for signing in to admin page.
@app.route("/sign-in", methods=["POST"])
def sign_in():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Missing username or password"}), 400

        _, users, passwords = readData(1)

        # Default password in case of missing database for users
        if username == "admin" and password == "admin":
            access_token = create_access_token(identity=username)
            return jsonify({"message": "Sign-in successful", "token": access_token})

        if username in users and bcrypt.checkpw(
            password.encode("utf-8"), passwords[users.index(username)].encode("utf-8")
        ):
            access_token = create_access_token(identity=username)
            return jsonify({"message": "Sign-in successful", "token": access_token})
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify(error=str(e)), 500


# Function responsible for fetching all data from QuesAns database
@app.route("/fetch-questions", methods=["GET"])
def fetch_questions():
    try:
        ids, questions, answers = readData(0)
        if not questions or not answers:
            return jsonify(data=[], message="No questions or answers found"), 200
        data = [
            {"id": ids[i], "question": questions[i], "answer": answers[i]}
            for i in range(len(questions))
        ]
        return jsonify(data=data)
    except Exception as e:
        return jsonify(error=str(e)), 500


# Function responsible for fetching all data from UserPass database
@app.route("/fetch-users", methods=["GET"])
@jwt_required()
def fetch_users():
    try:
        ids, users, passwords = readData(1)
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

        updateData(0, id, question, answer)
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

        ids, _, _ = readData(1)

        hashedPassword = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        # Logic to update the user in your database
        if user_id in ids:
            updateData(1, user_id, username, hashedPassword)
            return jsonify({"message": "User updated successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Function responsible for deleting question and answer in database.
@app.route("/delete-questions/<int:id>", methods=["DELETE"])
def delete_question(id):
    try:
        ids, _, _ = readData(0)
        if id in ids:
            deleteData(0, id)
            return jsonify({"message": "Question deleted successfully"})
        else:
            return jsonify({"error": "Question not found"}), 404
    except Exception as e:
        return jsonify(error=str(e)), 500


# Function responsible for deleting username and password in database.
@app.route("/delete-users/<int:id>", methods=["DELETE"])
def delete_user(id):
    try:
        ids, _, _ = readData(1)
        if id in ids:
            deleteData(1, id)
            return jsonify({"message": "User deleted successfully"})
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify(error=str(e)), 500


# Function responsible for addition of data to QuesAns database
@app.route("/add-question", methods=["POST"])
def add_question():
    try:
        data = request.json
        question = data.get("question")
        answer = data.get("answer")

        if not question or not answer:
            return jsonify({"error": "Missing question or answer"}), 400

        addData(0, question, answer)
        return jsonify({"message": "Question added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Function responsible for addition of data to UserPass database
@app.route("/add-user", methods=["POST"])
def add_user():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Missing username or password"}), 400

        _, usernames, _ = readData(1)

        hashedPassword = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        if username not in usernames:
            addData(1, username, hashedPassword)
            return jsonify({"message": "User added successfully"})
        else:
            return jsonify({"error": "User already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/clear-database/<string:mode>", methods=["DELETE"])
@jwt_required()
def clear_database(mode):
    try:
        if mode == "questions":
            clearData(0)
        elif mode == "users":
            clearData(1)
        else:
            return jsonify({"error": "Invalid mode"}), 400

        return jsonify(
            {"message": f"{mode.capitalize()} database cleared successfully"}
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


### Import/Export


# Check if the uploaded file is an Excel file
def allowed_file(filename):
    return filename.endswith(".xlsx") or filename.endswith(".xls")


# Export data from the database to an Excel file
@app.route("/export-data/<string:mode>", methods=["GET"])
def export_data(mode):
    try:
        if mode == "questions":
            ids, questions, answers = readData(0)
            df = pd.DataFrame({"ID": ids, "Question": questions, "Answer": answers})
        elif mode == "users":
            ids, users, passwords = readData(1)
            df = pd.DataFrame({"ID": ids, "Username": users, "Password": passwords})
        else:
            return jsonify({"error": "Invalid mode"}), 400

        output = BytesIO()
        df.to_excel(output, index=False)
        output.seek(0)
        return send_file(output, as_attachment=True, download_name=f"{mode}.xlsx")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Import data from an Excel file and save it to the database
@app.route("/import-data/<string:mode>", methods=["POST"])
def import_data(mode):
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if file and allowed_file(file.filename):
        try:
            # Read the Excel file into a DataFrame
            df = pd.read_excel(file)

            # Extract the appropriate columns and save them to the database
            if mode == "questions":
                for _, row in df.iterrows():
                    question = row.get("Question")
                    answer = row.get("Answer")
                    if pd.notna(question) and pd.notna(answer):
                        addData(0, question, answer)
            elif mode == "users":
                for _, row in df.iterrows():
                    username = row.get("Username")
                    password = row.get("Password")
                    if pd.notna(username) and pd.notna(password):
                        hashed_password = bcrypt.hashpw(
                            password.encode("utf-8"), bcrypt.gensalt()
                        )
                        addData(1, username, hashed_password)
            else:
                return jsonify({"error": "Invalid mode"}), 400

            return jsonify({"message": "Data imported successfully"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Invalid file format"}), 400


if __name__ == "__main__":
    app.run(debug=True)
