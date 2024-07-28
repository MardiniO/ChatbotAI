import React, { useState, useEffect } from "react";
import "./AdminModal.css";

const AdminModal = ({ show, onClose, onSave, data, mode, isAddMode }) => {
  // Two inputs, in one case for question/answer, in other case for user/password.
  const [input1, setInput1] = useState(data.input1 || "");
  const [input2, setInput2] = useState(data.input2 || "");

  useEffect(() => {
    // Init of text fields inside modal set to be empty or set to already existing data.
    setInput1(data.input1 || "");
    setInput2(data.input2 || "");
  }, [data]);

  // When modal hidden, return nothing.
  if (!show) {
    return null;
  }

  // Function responsible for Submit button functionality when committing the data.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: data.id, input1, input2 });
  };

  return (
    <div className="adminModal">
      <div className="adminModal-content">
        <div className="adminModal-header">
          <h2>
            {/* Since same modal is used for both Add/Update buttons, depending on button clicked, 
            functionality and text changes */}
            {isAddMode
              ? mode === "questions"
                ? "Add Question"
                : "Add User"
              : mode === "questions"
              ? "Update Question"
              : "Update User"}
          </h2>
          {/* Button to close modal. */}
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        {/* User input text fields */}
        <form onSubmit={handleSubmit} className="adminModal-formContent">
          <div className="adminModal-formGroup">
            <label>{mode === "questions" ? "Question" : "User"}</label>
            <input
              type="text"
              value={input1}
              placeholder={mode === "questions" ? "Question" : "User"}
              onChange={(e) => setInput1(e.target.value)}
            />
          </div>
          <div className="adminModal-formGroup">
            <label>{mode === "questions" ? "Answer" : "Password"}</label>
            <input
              type="text"
              value={input2}
              placeholder={mode === "questions" ? "Answer" : "Password"}
              onChange={(e) => setInput2(e.target.value)}
            />
          </div>
          <div className="adminModal-buttonContainer">
            <button type="submit" className="adminSubmit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
