import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import chatbotLogo from "../../assets/chatbot.png";

const SignIn = () => {
  // Text field input: username/password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Text for error message such as "invalid password" etc.
  // Message comes from backend.
  const [message, setMessage] = useState("");
  // Redirect function.
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Sending the information
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        localStorage.setItem("token", data.token); // Store the token in local storage
        navigateTo("/admin");
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="cardHeader">
        <h2> Sign In </h2>
      </div>
      <div className="signInBody">
        <form className="formContainer" onSubmit={handleSubmit}>
          <div className="userNameContainer">
            <label htmlFor="uname">Username</label>
            <input
              type="text"
              id="uname"
              className="username"
              placeholder="Your Username.."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="passWordContainer">
            <label htmlFor="pword">Password</label>
            <input
              type="password"
              id="pword"
              className="password"
              placeholder="Your Password.."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="signInButtonContainer">
            <input className="signInButton" type="submit" value="Submit" />
          </div>
        </form>
        <div className="logoContainer">
          <img src={chatbotLogo} className="signInLogo" alt="Chatbot Logo" />
        </div>
        {message && <div className="message">{message}</div>}
      </div>
    </>
  );
};

export default SignIn;
