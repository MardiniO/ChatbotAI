import React from "react";
import chatLogo from "../../assets/chatbot.png";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./NavbarElements";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />
        <NavMenu>
          <div className="titleContainer">
            <img src={chatLogo} alt="Chatbot Logo" className="logo" />
            <h1 className="title">
              <b> ChatBot </b>
            </h1>
          </div>
          <NavLink to="/"> Home </NavLink>
          <NavLink to="/admin"> Admin </NavLink>
          <NavLink to="/about"> About </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
