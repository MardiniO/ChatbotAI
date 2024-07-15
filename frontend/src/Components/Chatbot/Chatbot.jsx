import React, { useState, useEffect, useRef } from "react";

// Responsible for HTTP requests to backend
import axios from "axios";

// Importing CSS and images used on page.
import "./Chatbot.css";
import chatbotLogo from "../../assets/chatbot.png";
import userLogo from "../../assets/User-avatar.png";
// Importing modal
import Modal from "../../Components/Modal/Modal";

const Chatbot = () => {
  // Responsible for storing sent and received messages in a list.
  const [messages, setMessages] = useState([]);
  // Responsible for the data set inside the input field. Initially empty.
  const [inputData, setInputData] = useState("");
  // Responsible for modal state. Initially hidden.
  const [showModal, setShowModal] = useState(false);

  // Responsible for determining if content has overflowed in order to add shadow.
  // Also responsible for providing references to keep chat stickied to the bottom upon sending of a new message.
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);
  const cardBodyRef = useRef(null);

  // Function responsible for communication between user and chatbot.
  const sendData = async (e) => {
    // Prevents refresh upon sending data.
    e.preventDefault();
    const sentMessage = { text: inputData, sender: "user" };
    setMessages([...messages, sentMessage]);

    try {
      let receivedMessages = [];
      // Sends inputted data from the user to backend.
      const response = await axios.post("http://127.0.0.1:5000/receive", {
        data: inputData,
      });
      // Receives data from backend.
      const receivedMessage = { text: response.data.received, sender: "bot" };

      // If inputted data is similar to primary word in database,
      // then bot sends an additional message containing button to open modal.
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
      } else {
        receivedMessages = [receivedMessage];
      }

      // Responsible for storing previous messages before new interaction
      setMessages((prevMessages) => [...prevMessages, ...receivedMessages]);
      // Empties input field after submission.
      setInputData("");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    // Along with first useEffect, responsible for smoothly scrolling to bottom.
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

  // Functions for showing or hiding the modal.
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Responsible for setting text direction depending on language.
  const getDirection = (text) => {
    if (text.match(/[\u0600-\u06FF]/)) {
      return "rtl";
    } else {
      return "ltr";
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      {/* Link for arrow in button */}
      <div className={`cardHeader ${isScrolled ? "scrolled" : ""}`}>
        <h2>Chatbot</h2>
        <h3>Ask me Anything!</h3>
      </div>
      <div className="cardBody" ref={cardBodyRef}>
        {/* 
        For each message in messages, creates a container div with a different class depending
        on who is the sender.
        */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`msgContainer ${
              message.sender === "user" ? "userMsg" : "botMsg"
            }`}>
            {/* Depending on sender, provides a div with an image inside with a unique class.
                The images are the PFP for the user and the PFP for the bot.
             */}
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
            {/* Depending on sender, creates div that holds either 
            the inputted text or the received text.
            */}
            <div
              className={
                message.sender === "user" ? "sentMessage" : "receivedMessage"
              }
              dir={getDirection(message.text)}>
              <p>{message.text}</p>
              {message.options && message.options.modalButton && (
                <button className="openModalButton" onClick={() => openModal()}>
                  Open
                </button>
              )}
            </div>
          </div>
        ))}
        {/* div created at the bottom, used as reference to scroll to. */}
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
            value={inputData}
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
      {showModal && <Modal isOpen={showModal} onClose={closeModal}></Modal>}
    </>
  );
};

export default Chatbot;
