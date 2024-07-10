from flask import Flask, request, jsonify
from flask_cors import CORS
from chatBot import chatBot

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Route to receive data from the frontend
@app.route('/receive', methods=['POST'])
def receive_data():
    data = request.json  # Get the JSON data from the request
    received_string = data.get('data')  # Extract the string using the key 'data'
    # Pass the received string to chatBot function and get the response
    response_message = chatBot(received_string)
    # Return the response message in a JSON response
    return jsonify({"received": response_message})

if __name__ == '__main__':
    app.run(debug=True)
