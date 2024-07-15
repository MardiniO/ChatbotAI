import React, { useState, useEffect } from "react";
import "./Modal.css";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FilterComponent } from "../FilterComponent/FilterComponent";

const Modal = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterText, setFilterText] = useState("");
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
            setFilteredData(data);
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
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;

const customStyles = {
  header: {
    style: {
      minHeight: "56px",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#f8f9fa",
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
};
