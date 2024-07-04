import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import ChatbotUI from './Components/ChatbotUI/ChatbotUI'


const App = () => {
  return (
    <div className="container">
      <div className="navContainer">
        <Navbar/>
      </div>
      <div className="botContainer">
        <ChatbotUI/>
      </div>
    </div>
  )
}

export default App