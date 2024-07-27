from difflib import get_close_matches
from crudOperations import (
    connectToDatabase,
    readData,
    addData,
)


# Function that returns the closest result to the question from a list of questions
def find_best_match(user_question: str, questions: list[str]) -> str | None:
    # n for which answer to return n = 1 for best match, 2/3 for top two/three answers
    # cutoff or accuracy
    matches: list = get_close_matches(user_question, questions, n=1, cutoff=0.7)
    return matches[0] if matches else None


# Variable that decides whether next user input should be interpreted as a question
# or interpreted as an answer and added to the database
ifPrev = 0
# Variable that stores question if the next input is an answer
question: str


# Function responsible for chatting with chatBot
def chatBot(text):
    global ifPrev
    global question

    print(text)

    # Connecting to database and storing existing IDs, questions, and answers
    conn = connectToDatabase()
    cursor = conn.cursor()
    [_, DatabaseQues, DatabaseAns] = readData(0)
    cursor.close()
    conn.close()

    if not ifPrev:
        # Gets the best match for the question from the database and stores its corresponding answer and its index
        # The answer gets returned to be outputted to the web
        best_match: str | None = find_best_match(text, DatabaseQues)
        answer = None
        for q in DatabaseQues:
            if q == best_match:
                quesAnsIndex = DatabaseQues.index(q)
                answer = DatabaseAns[quesAnsIndex]
                break
        if best_match:
            return answer
        else:
            ifPrev = 1
            question = text
            if text.isascii():
                return "I don't know the answer. Can you teach me? \n Hint: Include @ at the beginning and end of the sentence for it to be inputted."
            else:
                return " لا أعرف الإجابة. هل بوسعك أن تعلمني؟ تلميح: ضع @ في بداية ونهاية الجملة لتتم إدخالها"
    else:
        ifPrev = 0
        print(text[0])
        if text[0] == "@" and text[(len(text)) - 1] == "@":
            text = text[1 : len(text) - 1]
            addData(0, question, text)
            if text.isascii():
                return "Thank you!"
            else:
                return "شكرا!"
        else:
            return "Nothing was learned. Thank you!"
