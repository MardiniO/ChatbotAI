This chatbot application is designed with a modern tech stack. The frontend is built using ReactJS and the backend with Flask, a lightweight Python web framework.  
The chatbot was initially trained using the "difflib" Python library, which allows it to perform basic text matching and response generation. This setup provides a solid foundation for the chatbot's capabilities.  
However, the current operation of the chatbot is built on Command R, a generational LLM built by Cohere; it significantly enhances the chatbot's conversational abilities, enabling it to understand and respond to a wider array of queries with greater accuracy and context.

The Python backend libraries used in this project:

- flask, flask_jwt_extended, flask_CORS, flask_bcrypt
- mysql.connector
- difflib, cohere
- pandas
- os, io
- datetime
- openpyxl

The NPM frontend libraries used in this project:

- react-router-dom
- axios
- react-data-table-component
- file-saver

The mySQL database was hosted through XAMPP.

Python v3.10 and NPM v20.16.0 are required.

The Flask backend runs on port 5000, "localhost:5000"  
The React frontend runs on port 5173, "localhost:5173"  
mySQL is hosted on port 3306

If replicating mySQL databases:

- The question/answer database is named "QuesAns" with three columns "id", "question", and "answer".
- The user/pass database is named "UserPass" with three columns "id", "username", and "password".

The UI is preliminary and designed to best fit a 13" screen.
