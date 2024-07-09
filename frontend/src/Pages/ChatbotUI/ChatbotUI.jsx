import React from "react";
import "./ChatbotUI.css";

const ChatbotUI = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "centre",
          alignItems: "centre",
          height: "100vh",
        }}>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <div className="cardCont">
          <div className="cardHeader">
            <h2> Chatbot </h2>
            <h3> Ask me Anything! </h3>
          </div>
          <div className="cardBody"></div>
          <div className="cardFooter">
            <form id="messageArea" class="messageArea">
              <input
                type="text"
                id="text"
                name="msg"
                placeholder="Type your message..."
                autocomplete="off"
                class="inputField"
                required
              />
              <div class="buttonCont">
                <button type="submit" id="send" class="submitButton">
                  <i class="fa fa-location-arrow"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatbotUI;
