import React from "react";
import "./FlashMessage.css";

const FlashMessage = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`flashMessage ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default FlashMessage;
