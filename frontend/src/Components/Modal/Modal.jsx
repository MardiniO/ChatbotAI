import React, { useState, useEffect } from "react";

// Library used for HTTP requests. In this case, responsible for fetching all the data from the database.
import axios from "axios";

import "./Modal.css";

import DataTable from "react-data-table-component";
import FilterComponent from "../FilterComponent/FilterComponent";

const Modal = ({ isOpen, onClose }) => {
  // Responsible for storing data in form of ("Question" : "...", "Answer" : "...")
  const [data, setData] = useState([]);
  // Responsible for filtering above data depending on specified filter in input field.
  const [filteredData, setFilteredData] = useState([]);
  // Responsible for holding the filter.
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    // If the modal is not open, do nothing.
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/fetch-questions"
        );
        // If the data was obtained successfully, store it.
        const data = response.data.data;
        setData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  }, [isOpen]);

  // Responsible for returning only the data that matches the specified filter.
  useEffect(() => {
    const filteredItems = data.filter(
      (item) =>
        (item.question &&
          item.question.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.answer &&
          item.answer.toLowerCase().includes(filterText.toLowerCase()))
    );

    setFilteredData(filteredItems);
  }, [filterText, data]);

  if (!isOpen) return null;

  // Columns inside the DataTable component with some styling.
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
    <div className={`modal ${isOpen ? "show" : ""}`}>
      {/* Modal div with either show added or blank */}
      <div className="modal-content">
        {/* Header holds close button and the FilterComponent */}
        <div className="modalHeader">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          {/* Passes filter text, returns filtered data */}
          <FilterComponent
            filterText={filterText}
            onFilter={(e) => setFilterText(e.target.value)}
            className="searchComponent"
          />
        </div>
        <div className="modalBody">
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

export default Modal;
