from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from chatBot import chatBot
from crudOperations import *
from excelReader import *
import os

app = Flask(__name__)
app.secret_key = 'secretkey'


# Function that returns home page HTML (where ChatBot exists)
@app.route('/')
def index():
    return render_template("index.html")


# Function in INDEX that returns the inputted message from user in HTML page
@app.route('/get', methods=["GET", "POST"])
def chat():
    msg = request.form["msg"]
    return chatBot(msg)


# Function that returns admin page HTML (managing database)
@app.route('/CRUD.html')
def crud():
    data = fetchAllData()
    return render_template("CRUD.html", data=data)


# Function used in CRUD in order to delete item from database
@app.route('/delete/<id>/', methods=["GET", "POST"])
def delete(givenID):
    deleteData(givenID)
    flash("Employee deleted successfully!")
    return redirect(url_for('crud'))


# Function used in CRUD in order to update item from database
@app.route('/update', methods=["GET", "POST"])
def update():
    if request.method == "POST":
        givenID = request.form.get('id')
        question = request.form['question']
        answer = request.form['answer']

        try:
            updateData(givenID, question, answer)
            flash("Q/A Updated Successfully.")
            return redirect(url_for('crud'))
        except Exception as e:
            print("Error updating:" + str(e))


# Function used in CRUD in order to add item to database
@app.route('/insert', methods=["POST"])
def insert():
    if request.method == "POST":
        question = request.form["question"]
        answer = request.form["answer"]

        addToDatabase(question, answer)
        flash("Q/A Added Successfully")

        return redirect(url_for('crud'))


# Function used to upload excel file to webpage and insert data in it to SQL database
@app.route('/upload', methods=["GET", "POST"])
def upload():
    if request.method == "POST":
        file = request.files['fileInsert']
        # If file is uploaded and if file is of excel format
        if file and allowed_file(file.filename):
            # Creates a temporary file for the uploaded file in order to read and manage it
            filepath = f"/tmp/{file.filename}"
            file.save(filepath)

            # Reads file and then deletes it from storage
            data = readExcel(filepath)
            os.remove(filepath)

            # Data is stored in form of nested list with index [0] for questions, index [1] for answers
            # Loops over all data adding each one by one
            # This could be a point to improve performance since it is O(n) for reading data and then adding it.
            for i in data:
                addToDatabase(i[0], i[1])

            return redirect(url_for('crud'))

        else:
            flash("Invalid file format. Please upload an Excel file.")
            return redirect(url_for('crud'))


@app.route('/data')
def data():
    try:
        # Retrieve request parameters
        draw = int(request.args.get('draw', 1))
        start = int(request.args.get('start', 0))
        length = int(request.args.get('length', 10))

        # Connect to the database
        conn = connectToDatabase()
        cursor = conn.cursor()

        # Count total records
        cursor.execute("SELECT COUNT(*) FROM QuesAns")
        total_records = cursor.fetchone()[0]

        # Fetch the requested data
        query = f"SELECT id, question, answer FROM QuesAns LIMIT {length} OFFSET {start}"
        cursor.execute(query)
        data = cursor.fetchall()

        # Close the connection
        conn.close()

        # Format the response
        response_data = []
        for row in data:
            response_data.append(list(row) + [f'<a href="#/update/{row[0]}" class="editButton" data-toggle="modal" data-target="#modaledit{row[0]}"> Edit </a> <a href="/delete/{row[0]}" class="deleteButton" onclick="return confirm(\'Are you sure you want to delete?\')"> Delete </a>'])

        response = {
            'draw': draw,
            'recordsTotal': total_records,
            'recordsFiltered': total_records,
            'data': response_data
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
