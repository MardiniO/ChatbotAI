import React, { useState, useEffect } from "react";
import "./Modal.css";
import axios from "axios";
import DataTable from "react-data-table-component";

const Modal = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/fetch-questions"
        );
        if (response.status === 200) {
          const data = response.data.data;
          if (Array.isArray(data)) {
            setData(data);
          } else {
            throw new Error("Invalid data format received");
          }
        } else {
          throw new Error("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("There was an error fetching the questions.");
      }
    };

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  const columns = [
    { name: "Question", selector: (row) => row.question, sortable: true },
    { name: "Answer", selector: (row) => row.answer, sortable: true },
  ];

  return (
    <div className={`modal ${isOpen ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            striped
            className="ModalDataTable"
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
