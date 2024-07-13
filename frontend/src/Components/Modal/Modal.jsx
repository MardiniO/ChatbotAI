import React, { useState, useEffect } from "react";
import "./Modal.css";
import DataTable from "react-data-table-component";
import axios from "axios";

const Modal = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/fetch-questions"
        );
        if (response.status === 200) {
          const data = response.data.data; // Accessing the 'data' array from the response
          if (Array.isArray(data)) {
            const fetchedQuestions = data.map((item) => item.question);
            const fetchedAnswers = data.map((item) => item.answer);
            setQuestions(fetchedQuestions);
            setAnswers(fetchedAnswers);
          } else {
            throw new Error("Invalid data format received");
          }
        } else {
          throw new Error("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  if (!isOpen) return null;

  const columns = [
    { name: "Question", selector: "question", sortable: true },
    { name: "Answer", selector: "answer", sortable: true },
  ];

  const data = questions.map((question, index) => ({
    question,
    answer: answers[index],
  }));

  return (
    <div className={`modal ${isOpen ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
};

export default Modal;
