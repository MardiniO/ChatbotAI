import mysql.connector


# Function that connects to the database and returns the connection
def connectToDatabase():
    conn = mysql.connector.connect(
        host="127.0.0.1", user="root", password="", database="scs"
    )
    return conn


####
# Database Control
####

# databaseName added for sake of simplifying and reducing code.
# 0 corresponding to QuesAns, 1 corresponding to UserPass.
# Code can further be reduced by changing database name inside of SQL query.
# However, it caused some issues. Current method is fine.


# CREATE OPERATION
# Function that adds data to the database
def addData(databaseName, databaseInput1, databaseInput2):
    # Connecting to database and storing existing IDs, data column 1, and data column 2
    conn = connectToDatabase()
    cursor = conn.cursor()

    if databaseName == 0:
        mySQLInsert = """INSERT INTO QuesAns (question, answer)
        VALUES (%s, %s) """

        record = (databaseInput1, databaseInput2)
        cursor.execute(mySQLInsert, record)
    else:
        mySQLInsert = """INSERT INTO UserPass (username, password)
        VALUES (%s, %s) """

        record = (databaseInput1, databaseInput2)
        cursor.execute(mySQLInsert, record)

    conn.commit()
    cursor.close()
    conn.close()

    return None


# Function that returns data from database with each column of database separated
# READ OPERATION
def readData(databaseName):
    conn = connectToDatabase()
    myCursor = conn.cursor()

    # Initializing lists that store the separate data of the database, (ids, input1, input2)
    if databaseName == 0:
        column1, column2, column3 = ([] for _ in range(3))

        myCursor.execute("select * from QuesAns")
        result = myCursor.fetchall()
        for x in result:
            column1.append(x[0])
            column2.append(x[1])
            column3.append(x[2])
        conn.close()
        return column1, column2, column3
    else:
        column1, column2, column3 = ([] for _ in range(3))

        myCursor.execute("select * from UserPass")
        result = myCursor.fetchall()
        for x in result:
            column1.append(x[0])
            column2.append(x[1])
            column3.append(x[2])
        conn.close()
        return column1, column2, column3


# Function that updates data in the database depending on input given
# UPDATE OPERATION
def updateData(databaseName, databaseID, databaseInput1, databaseInput2):
    conn = connectToDatabase()
    myCursor = conn.cursor()

    if databaseName == 0:
        mySQLUpdate = """UPDATE QuesAns 
                        SET question = %s, answer = %s 
                        WHERE id = %s """

        record = (databaseInput1, databaseInput2, databaseID)
        myCursor.execute(mySQLUpdate, record)
    else:
        mySQLUpdate = """UPDATE UserPass 
                     SET username = %s, password = %s 
                     WHERE id = %s """

        record = (databaseInput1, databaseInput2, databaseID)
        myCursor.execute(mySQLUpdate, record)

    conn.commit()
    conn.close()

    return None


# Function that deletes data in the database depending on input given
# DELETE OPERATION
def deleteData(databaseName, givenID):
    conn = connectToDatabase()
    myCursor = conn.cursor()

    # (givenID,) written in order to format as tuple
    if databaseName == 0:
        mySQLDelete = """DELETE FROM QuesAns WHERE id = %s"""
        myCursor.execute(mySQLDelete, (givenID,))
    else:
        mySQLDelete = """DELETE FROM UserPass WHERE id = %s"""
        myCursor.execute(mySQLDelete, (givenID,))

    conn.commit()
    conn.close()
    return None


def clearData(databaseName):
    try:
        # Connect to the database
        conn = connectToDatabase()
        myCursor = conn.cursor()

        if databaseName == 0:
            mySQLClear = """DELETE FROM QuesAns"""
            myCursor.execute(mySQLClear)
            conn.commit()
            return "QuesAns table cleared successfully"
        elif databaseName == 1:
            mySQLClear = """DELETE FROM UserPass"""
            myCursor.execute(mySQLClear)
            conn.commit()
            return "UserAns cleared successfully"
        else:
            return "Invalid database selection"

    except Exception as e:
        # Handle exceptions
        print(f"An error occurred: {e}")
        return f"An error occurred: {str(e)}"

    finally:
        # Ensure the connection is closed properly
        if myCursor:
            myCursor.close()
        if conn:
            conn.close()


# Function that returns data from database with all data joined in one list
# Lowks forgot where this is used. Keeping it just in case.
# READ OPERATION
def fetchAllData():
    conn = connectToDatabase()
    myCursor = conn.cursor()

    myCursor.execute("select * from QuesAns")
    result = myCursor.fetchall()
    conn.close()
    return result
