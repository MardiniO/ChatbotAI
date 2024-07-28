import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatbotModal.css";
import DataTable from "react-data-table-component";
import FilterComponent, { useFilter } from "../FilterComponent/FilterComponent"; // Import the combined component and hook

// Modal component for chatbot when similarity is detected.

const ChatbotModal = ({ isOpen, onClose }) => {
  // Initial passed data into var: "data" = []
  const [data, setData] = useState([]);
  // For the filtered data to be stored.
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    // If button not pressed, return nothing (no modal).
    if (!isOpen) return;

    // Fetch the Questions and Answers to display all articles or "madat".
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/fetch-questions"
        );
        const data = response.data.data;
        setData(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  }, [isOpen]);

  // Custom hook from FilterComponent.jsx
  // Use the custom hook to get the filtered data
  const filteredData = useFilter(data, filterText);

  // Initialization and Styling of columns of data table.
  const columns = [
    {
      name: "Question",
      selector: (row) => row.question,
      sortable: true,
      wrap: true,
      width: "50%",
    },
    {
      name: "Answer",
      selector: (row) => row.answer,
      sortable: true,
      wrap: true,
      width: "50%",
    },
  ];

  return (
    <div className={`chatbotModal ${isOpen ? "show" : ""}`}>
      <div className="chatbotModal-content">
        <div className="chatbotModal-header">
          {/* Modal header contains close button in addition to search bar to filter data. */}
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <FilterComponent
            filterText={filterText}
            onFilter={(e) => setFilterText(e.target.value)}
            className="searchComponent"
          />
        </div>
        <div className="chatbotModal-body">
          {/* Modal body only contains data table */}
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            className="ModalDataTable"
            dense
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
