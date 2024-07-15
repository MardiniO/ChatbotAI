import React from "react";
import chatLogo from "../../assets/chatbot.png";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <Nav>
        <div className="titleContainer">
          <img src={chatLogo} alt="Chatbot Logo" className="logo" />
          <h1 className="title">
            <b> ChatBot </b>
          </h1>
        </div>
        <div className="logoSeparator" />
        <NavMenu>
          <NavLink to="/"> Home </NavLink>
          <NavLink to="/about"> About </NavLink>
          <NavLink to="/signin">Admin</NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
