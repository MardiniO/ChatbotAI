from flask import Flask, request, jsonify
from flask_cors import CORS
from chatBot import chatBot
from crudOperations import readVariablesFromTable

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Route to receive data from the frontend
@app.route('/receive', methods=['POST'])
def receive_data():
    try:
        data = request.json  # Get the JSON data from the request
        received_string = data.get('data')  # Extract the string using the key 'data'
        
        if not received_string:
            return jsonify(error="No data provided"), 400
        
        # Pass the received string to chatBot function and get the response
        response_message = chatBot(received_string)
        # Return the response message in a JSON response
        return jsonify({"received": response_message})
    except Exception as e:
        return jsonify(error=str(e)), 500  # Return error message and status code

# Route to fetch questions and answers from the database
@app.route('/fetch-questions', methods=['GET'])
def fetch_questions():
    try:
        id, questions, answers = readVariablesFromTable()

        if not questions or not answers:
            return jsonify(error="No questions or answers found"), 404

        data = [
            {'question': questions[i], 'answer': answers[i]}
            for i in range(len(questions))
        ]

        print(data)  # Log the data to verify structure
        return jsonify(data=data)  # Return data as JSON array of objects
    except Exception as e:
        return jsonify(error=str(e)), 500  # Return error message and status code

if __name__ == '__main__':
    app.run(debug=True)
