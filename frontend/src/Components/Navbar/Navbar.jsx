import React from "react";
import chatLogo from "../../assets/chatbot.png";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
import "./Navbar.css";

// Navbar component, initialized in App.jsx to appear in every page.
// Functionality of Navbar contained in Navbar Elements.
// For extra information or documentation on this particular Navbar functionality,
// https://www.geeksforgeeks.org/create-a-responsive-navbar-using-reactjs/

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
