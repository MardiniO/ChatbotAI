import React from "react";

// Responsible for the navigation to different pages in Navbar
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing Navbar component
// Other imported components are fed into the template
import Navbar from "./Components/Navbar/Navbar";
import Template from "./Pages/Template/Template";
import Chatbot from "./Pages/Chatbot/Chatbot";
import SignIn from "./Pages/SignIn/SignIn";
import About from "./Pages/About/About";

const App = () => {
  return (
    <div className="container">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Template Component={Chatbot} />} />
          <Route path="/about" element={<Template Component={About} />} />
          <Route path="/signin" element={<Template Component={SignIn} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
