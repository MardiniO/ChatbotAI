import React, { useState } from "react";
import axios from "axios";
import "./ChatbotUI.css";

const ChatbotUI = () => {
  const [receivedData, setReceivedData] = useState(null);
  const [inputData, setInputData] = useState("");

  const sendData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/receive", {
        data: inputData,
      });
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/send");
      setReceivedData(response.data);
    } catch (error) {
      console.error("Error receiving data:", error);
    }
  };

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
          <div className="cardHeader">
            <h2> Chatbot </h2>
            <h3> Ask me Anything! </h3>
          </div>
          <div className="cardBody">
            {receivedData && (
              <div>
                <h2>Received Data</h2>
                <pre>{JSON.stringify(receivedData, null, 2)}</pre>
              </div>
            )}
          </div>
          <div className="cardFooter">
            <form id="messageArea" className="messageArea">
              <input
                type="text"
                id="text"
                name="msg"
                placeholder="Type your message..."
                autoComplete="off"
                onChange={(e) => setInputData(e.target.value)}
                className="inputField"
                required
              />
              <div className="buttonCont">
                <button
                  type="submit"
                  id="send"
                  className="submitButton"
                  onClick={sendData}>
                  <i className="fa fa-location-arrow"></i>
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
