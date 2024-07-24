import mysql.connector


# Function that connects to the database and returns the connection
def connectToDatabase():
    conn = mysql.connector.connect(
        host="127.0.0.1", user="root", password="", database="scs"
    )
    return conn


####
# QuesAns database Control
####


# Function that adds questions and answers to the database
# CREATE OPERATION
def addQuesToDatabase(InQuestion, InAnswer):
    # Connecting to database and storing existing IDs, questions, and answers
    conn = connectToDatabase()
    cursor = conn.cursor()

    # Inserting records into database
    mySQLInsert = """INSERT INTO QuesAns (question, answer)
     VALUES (%s, %s) """

    record = (InQuestion, InAnswer)
    cursor.execute(mySQLInsert, record)

    conn.commit()
    cursor.close()
    conn.close()
    return None


# Function that returns data from database with each column of database separated
# READ OPERATION
def readQuesData():
    conn = connectToDatabase()
    myCursor = conn.cursor()

    # Initializing lists that store the separate data of the database
    column1, column2, column3 = ([] for _ in range(3))

    myCursor.execute("select * from QuesAns")
    result = myCursor.fetchall()
    for x in result:
        column1.append(x[0])
        column2.append(x[1])
        column3.append(x[2])
    conn.close()
    return column1, column2, column3


# Function that returns data from database with all data joined in one list
# READ OPERATION
def fetchAllData():
    conn = connectToDatabase()
    myCursor = conn.cursor()

    myCursor.execute("select * from QuesAns")
    result = myCursor.fetchall()
    conn.close()
    return result


# Function that updates data in the database depending on input given
# UPDATE OPERATION
def updateQuesData(DatabaseID, DatabaseQuestion, DatabaseAnswer):
    conn = connectToDatabase()
    myCursor = conn.cursor()

    mySQLUpdate = """UPDATE QuesAns 
                     SET question = %s, answer = %s 
                     WHERE id = %s """

    record = (DatabaseQuestion, DatabaseAnswer, DatabaseID)
    myCursor.execute(mySQLUpdate, record)

    conn.commit()
    conn.close()
    return None


# Function that deletes data in the database depending on input given
# DELETE OPERATION
def deleteQuesData(givenID):
    conn = connectToDatabase()
    myCursor = conn.cursor()

    mySQLDelete = """DELETE FROM QuesAns WHERE id = %s"""
    print("not deleting")
    # (givenID,) written in order to format as tuple
    myCursor.execute(mySQLDelete, (givenID,))

    conn.commit()
    conn.close()
    return None


####
# UserPass database Control
####


# Function that returns data from database with each column of database separated
# READ OPERATION
def readUserData():
    conn = connectToDatabase()
    myCursor = conn.cursor()

    # Initializing lists that store the separate data of the database
    column1, column2, column3 = ([] for _ in range(3))

    myCursor.execute("select * from UserPass")
    result = myCursor.fetchall()
    for x in result:
        column1.append(x[0])
        column2.append(x[1])
        column3.append(x[2])
    conn.close()
    return column1, column2, column3


def addUserToDatabase(InUser, InPass):
    # Connecting to database and storing existing IDs, questions, and answers
    conn = connectToDatabase()
    cursor = conn.cursor()

    # Inserting records into database
    mySQLInsert = """INSERT INTO UserPass (username, password)
     VALUES (%s, %s) """

    record = (InUser, InPass)
    cursor.execute(mySQLInsert, record)

    conn.commit()
    cursor.close()
    conn.close()
    return None


def deleteUserData(givenID):
    conn = connectToDatabase()
    myCursor = conn.cursor()

    mySQLDelete = """DELETE FROM UserPass WHERE id = %s"""
    # (givenID,) written in order to format as tuple
    myCursor.execute(mySQLDelete, (givenID,))

    conn.commit()
    conn.close()
    return None


def updateUserData(DatabaseID, DatabaseUser, DatabasePassword):
    conn = connectToDatabase()
    myCursor = conn.cursor()

    mySQLUpdate = """UPDATE UserPass 
                     SET username = %s, password = %s 
                     WHERE id = %s """

    record = (DatabaseUser, DatabasePassword, DatabaseID)
    myCursor.execute(mySQLUpdate, record)

    conn.commit()
    conn.close()
    return None
