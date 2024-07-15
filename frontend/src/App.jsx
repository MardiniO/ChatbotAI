import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Template from "./Pages/Template/Template";
import Navbar from "./Components/Navbar/Navbar";
import Chatbot from "./Components/Chatbot/Chatbot";
import Admin from "./Pages/Admin/Admin";
import About from "./Pages/About/About";

const App = () => {
  return (
    <div className="container">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Template Component={Chatbot} />} />
          <Route path="/about" element={<Template Component={About} />} />
          <Route path="/admin" element={<Template Component={Admin} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
