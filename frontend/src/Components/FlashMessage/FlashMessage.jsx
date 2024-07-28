import React from "react";
import "./FlashMessage.css";

// Simple flash message component. Consists of message + "x" with close function passed into it.

const FlashMessage = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`flashMessage ${type}`}>
      <span>{message}</span>
      {/* &times as in the multiplication symbol. */}
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default FlashMessage;
