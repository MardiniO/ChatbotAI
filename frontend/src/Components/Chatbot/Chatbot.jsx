import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../Pages/ChatbotUI/ChatbotUI.css";
import Modal from "../../Components/Modal/Modal";

import chatbotLogo from "../../assets/chatbot.png";
import userLogo from "../../assets/User-avatar.png";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputData, setInputData] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const scrollRef = useRef(null);
  const cardBodyRef = useRef(null);

  const sendData = async (e) => {
    e.preventDefault();
    const sentMessage = { text: inputData, sender: "user" };
    setMessages([...messages, sentMessage]);

    try {
      let receivedMessages = [];
      const response = await axios.post("http://127.0.0.1:5000/receive", {
        data: inputData,
      });
      const receivedMessage = { text: response.data.received, sender: "bot" };

      if (
        inputData.includes("ماد") ||
        inputData.includes("ادة") ||
        inputData.includes("ماده") ||
        inputData.includes("اده")
      ) {
        receivedMessages = [
          receivedMessage,
          {
            text: "هل تبحث عن المواد؟",
            sender: "bot",
            options: {
              modalButton: true,
            },
          },
        ];
        setModalContent("هل تبحث عن المواد؟");
      } else {
        receivedMessages = [receivedMessage];
      }

      setMessages((prevMessages) => [...prevMessages, ...receivedMessages]);
      setInputData("");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getDirection = (text) => {
    if (text.match(/[\u0600-\u06FF]/)) {
      return "rtl";
    } else {
      return "ltr";
    }
  };

  return (
    <>
      <div className={`cardHeader ${isScrolled ? "scrolled" : ""}`}>
        <h2>Chatbot</h2>
        <h3>Ask me Anything!</h3>
      </div>
      <div className="cardBody" ref={cardBodyRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`msgContainer ${
              message.sender === "user" ? "userMsg" : "botMsg"
            }`}>
            <div
              className={
                message.sender === "user"
                  ? "sentImgContainer"
                  : "receivedImgContainer"
              }>
              <img
                src={message.sender === "user" ? userLogo : chatbotLogo}
                className={
                  message.sender === "user" ? "sentImg" : "receivedImg"
                }
                alt={`${message.sender} logo`}
              />
            </div>
            <div
              className={
                message.sender === "user" ? "sentMessage" : "receivedMessage"
              }
              dir={getDirection(message.text)}>
              <p>{message.text}</p>
              {message.options && message.options.modalButton && (
                <button
                  className="openModalButton"
                  onClick={() => openModal("Random text or dynamic content")}>
                  Open
                </button>
              )}
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
      {showModal && (
        <Modal isOpen={showModal} onClose={closeModal}>
          {modalContent}
        </Modal>
      )}
    </>
  );
};

export default Chatbot;
