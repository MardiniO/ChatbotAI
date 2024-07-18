import React from "react";
import "./SignIn.css";
import chatbotLogo from "../../assets/chatbot.png";

const SignIn = () => {
  return (
    <>
      <div className="cardHeader">
        <h2> Sign In </h2>
      </div>
      <div className="signInBody">
        <form className="formContainer">
          <div className="userNameContainer">
            <label for="uname">Username</label>
            <input
              type="text"
              id="uname"
              className="username"
              placeholder="Your Username.."></input>
          </div>
          <div className="passWordContainer">
            <label for="pword">Password</label>
            <input
              type="text"
              id="pword"
              className="password"
              placeholder="Your Password.."></input>
          </div>
          <div className="signInButtonContainer">
            <input className="signInButton" type="submit" value="Submit" />
          </div>
        </form>
        <div className="logoContainer">
          <img src={chatbotLogo} className="signInLogo" />
        </div>
      </div>
    </>
  );
};

export default SignIn;
