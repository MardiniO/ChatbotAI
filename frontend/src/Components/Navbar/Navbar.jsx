import React from "react";
import chatLogo from "../../assets/chatbot.png";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          <div className="titleContainer">
            <img src={chatLogo} alt="Chatbot Logo" className="logo" />
            <h1 className="title">
              <b> ChatBot </b>
            </h1>
          </div>
          <div className="logoSeparator" />
          <NavLink to="/"> Home </NavLink>
          <NavLink to="/about"> About </NavLink>
          <NavLink to="/admin"> Admin </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
