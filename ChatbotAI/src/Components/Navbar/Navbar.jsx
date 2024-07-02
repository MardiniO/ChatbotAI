import React from 'react'
import './Navbar.css'
import chatLogo from '../../assets/chatbot.png'

const Navbar = () => {
  return (
    <div className="navContainer">
        <div className="titleContainer">
            <img src={ chatLogo } alt="Chatbot Logo" className="logo"/>
            <h1 className="title"><b> ChatBot </b></h1>
        </div>
        <ul>
            <li> Home </li>
            <li> Admin </li>
            <li> About </li>
        </ul>
    </div>
  )
}

export default Navbar