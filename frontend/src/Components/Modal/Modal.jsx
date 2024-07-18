import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.css";
import DataTable from "react-data-table-component";
import FilterComponent, { useFilter } from "../FilterComponent/FilterComponent"; // Import the combined component and hook

const Modal = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    if (!isOpen) return;

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

  // Use the custom hook to get the filtered data
  const filteredData = useFilter(data, filterText);

  if (!isOpen) return null;

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
      <div className="modal-content">
        <div className="modalHeader">
          <span className="close" onClick={onClose}>
            &times;
          </span>
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
