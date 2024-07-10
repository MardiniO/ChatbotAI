import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatbotUI.css";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([]); // State array for all messages
  const [inputData, setInputData] = useState("");
  const [isScrolled, setIsScrolled] = useState(false); // State to track scroll position
  const scrollRef = useRef(null); // Ref for the scroll lock element
  const cardBodyRef = useRef(null); // Ref for the cardBody element

  const sendData = async (e) => {
    e.preventDefault(); // Prevent form submission
    const sentMessage = { text: inputData, sender: "user" };
    setMessages([...messages, sentMessage]); // Add the sent message to the array

    try {
      const response = await axios.post("http://127.0.0.1:5000/receive", {
        data: inputData,
      });
      const receivedMessage = { text: response.data.received, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, receivedMessage]); // Add the received message to the array
      setInputData(""); // Clear the input field
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // Scroll to the bottom whenever the messages array is updated
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Add event listener to cardBody for scroll events
  useEffect(() => {
    const cardBody = cardBodyRef.current;

    const handleScroll = () => {
      setIsScrolled(cardBody.scrollTop > 0);
    };

    if (cardBody) {
      cardBody.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (cardBody) {
        cardBody.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
          <div className={`cardHeader ${isScrolled ? "scrolled" : ""}`}>
            <h2>Chatbot</h2>
            <h3>Ask me Anything!</h3>
          </div>
          <div className="cardBody" ref={cardBodyRef}>
            {messages.map((message, index) => (
              <div className="textContainer" key={index}>
                <div
                  className={
                    message.sender === "user"
                      ? "sentMessage"
                      : "receivedMessage"
                  }>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div className="scrollLock" ref={scrollRef}></div>
          </div>
          <div className="cardFooter">
            <form id="messageArea" className="messageArea" onSubmit={sendData}>
              <input
                type="text"
                id="text"
                name="msg"
                placeholder="Type your message..."
                autoComplete="off"
                value={inputData} // Bind the input value to inputData state
                onChange={(e) => setInputData(e.target.value)}
                className="inputField"
                required
              />
              <div className="buttonCont">
                <button type="submit" id="send" className="submitButton">
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
