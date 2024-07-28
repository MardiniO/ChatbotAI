import React from "react";

import "./About.css";

// About page. Simple.

const About = () => {
  return (
    <>
      <div className="aboutHeader">
        <h2> About this project </h2>
      </div>
      <div className="aboutBody">
        <p className="aboutText">
          This chatbot application is designed with a modern tech stack. The
          frontend is built using ReactJS, providing a responsive and dynamic
          user interface. The backend uses Flask, a lightweight Python web
          framework, ensuring efficient and robust server-side operations. The
          chatbot is initially trained using the "difflib" Python library, which
          allows it to perform basic text matching and response generation. This
          setup provides a solid foundation for the chatbot's capabilities.
          However, the vision for this project extends further, with plans to
          integrate a Large Language Model (LLM) in the future. This integration
          aims to significantly enhance the chatbot's conversational abilities,
          enabling it to understand and respond to a wider array of queries with
          greater accuracy and context.
        </p>
      </div>
    </>
  );
};

export default About;
