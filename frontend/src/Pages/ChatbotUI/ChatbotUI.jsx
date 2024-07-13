import React from "react";
import "./ChatbotUI.css";
import Chatbot from "../../Components/Chatbot/Chatbot";

const ChatbotUI = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <div className="cardCont">
          <Chatbot />
        </div>
      </div>
    </>
  );
};

export default ChatbotUI;
