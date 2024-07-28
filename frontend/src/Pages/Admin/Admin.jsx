import React, { useState, useEffect, useRef } from "react";
import "./Admin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import FilterComponent, {
  useFilter,
} from "../../Components/FilterComponent/FilterComponent";
import FlashMessage from "../../Components/FlashMessage/FlashMessage";
import AdminModal from "../../Components/AdminModal/AdminModal";
import { saveAs } from "file-saver"; // Import file-saver

// Importing functions from AdminFunctions.js
import {
  fetchData,
  fetchFirstUser,
  handleUpdate,
  handleDelete,
  handleSave,
  handleSwitchDatabase,
  handleLogOut,
  handleClearDatabase, // Import the function
} from "./AdminFunctions";

const Admin = () => {
  // Variables to set initial data and then filtered data.
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");

  // Responsible for either showing or hiding the modal.
  const [showModal, setShowModal] = useState(false);

  // "mode" used to differentiate functions depending on which database is shown.
  // E.G: if QuesAns shown, add-question is utilized instead of add-user.
  // Initially set to questions.
  const [mode, setMode] = useState("questions");
  // currentData is responsible for adding/updating either QuesAns or UserPass data.
  const [currentData, setCurrentData] = useState({});
  // isAddMode responsible for changing the characteristics of modal when either
  // add or update button is pressed.
  const [isAddMode, setIsAddMode] = useState(true);

  // Stores firstUser as default to prevent it from being deleted.
  const [firstUser, setFirstUser] = useState(null);

  // States for flashMesssage, determine the message displayed in the flash message.
  // Also determines the color of the flash message depending on success or failure.
  const [flashMessage, setFlashMessage] = useState("");
  const [flashType, setFlashType] = useState("success");

  // Responsible for redirecting to different pages.
  const navigateTo = useNavigate();

  // Ref for file input to trigger click event programmatically
  const fileInputRef = useRef();

  // Fetches first user.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigateTo("/signin");
    } else {
      fetchData(mode, setData, navigateTo);
      if (mode === "users") {
        fetchFirstUser(setFirstUser);
      }
    }
  }, [mode]);

  // Blank text fields on modal when add button is pressed.
  const handleAdd = () => {
    setShowModal(true);
    setCurrentData({ id: null, input1: "", input2: "" });
    setIsAddMode(true);
  };

  const handleCloseFlashMessage = () => {
    setFlashMessage(""); // Removes flash message on close.
  };

  const filteredData = useFilter(data, filterText); // Stores filtered data to be fed into datatable.

  // Handle importing data from an Excel file
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFlashMessage("No file selected");
      setFlashType("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:5000/import-data/${mode}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message) {
        setFlashMessage(response.data.message);
        setFlashType("success");
        fetchData(mode, setData, navigateTo); // Refresh data after import
      }
    } catch (error) {
      setFlashMessage(error.response?.data?.error || "Import failed");
      setFlashType("error");
    }
  };

  // Handle exporting data to an Excel file
  const handleExport = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/export-data/${mode}`,
        {
          responseType: "blob",
        }
      );

      // Save the file using file-saver
      const filename = mode === "questions" ? "questions.xlsx" : "users.xlsx";
      saveAs(response.data, filename);
    } catch (error) {
      setFlashMessage("Export failed");
      setFlashType("error");
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Columns for datatable
  // Depending on mode, sets column title
  const columns = [
    {
      name: mode === "questions" ? "Question" : "Username",
      selector: (row) => (mode === "questions" ? row.question : row.username),
      sortable: true,
      wrap: true,
      width: "40%",
    },
    {
      name: mode === "questions" ? "Answer" : "Password",
      selector: (row) => (mode === "questions" ? row.answer : row.password),
      sortable: true,
      wrap: true,
      width: "40%",
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <div className="actionButtonCont">
            <button
              onClick={() =>
                handleUpdate(
                  row,
                  setShowModal,
                  setCurrentData,
                  setIsAddMode,
                  mode
                )
              }>
              Update
            </button>
            <button
              onClick={() =>
                handleDelete(
                  row,
                  mode,
                  firstUser,
                  setFlashMessage,
                  setFlashType,
                  fetchData,
                  setData,
                  navigateTo
                )
              }>
              Delete
            </button>
          </div>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "20%",
    },
  ];

  return (
    <>
      <div className="adminPageCont">
        <div className="adminPanel">
          <button
            onClick={() => handleSwitchDatabase(setMode)}
            className="switchButton">
            Switch Database
          </button>
          <div className="buttonSeparator" />
          <div className="databaseControl">
            <button onClick={handleAdd}>Add</button>
            <input
              type="file"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              ref={fileInputRef} // Use ref instead of id
              onChange={handleImport}
            />
            <button onClick={triggerFileInput} className="importButton">
              Import data
            </button>
            <button onClick={handleExport}>Export data</button>
            <button
              onClick={() =>
                handleClearDatabase(
                  mode,
                  setFlashMessage,
                  setFlashType,
                  fetchData,
                  setData,
                  navigateTo
                )
              }>
              Clear database
            </button>
          </div>
          <div className="buttonSeparator" />
          <button
            onClick={() => handleLogOut(navigateTo)}
            className="logoutButton">
            Logout
          </button>
        </div>
        <div className="adminBody">
          <div className="adminHeader">
            <FilterComponent
              filterText={filterText}
              onFilter={(e) => setFilterText(e.target.value)}
            />
          </div>
          <div className="adminTable">
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              striped
              className="ModalDataTable"
            />
          </div>
        </div>
      </div>
      <AdminModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={(updatedData) =>
          handleSave(
            updatedData,
            mode,
            setFlashMessage,
            setFlashType,
            setShowModal,
            fetchData,
            setData,
            navigateTo
          )
        }
        data={currentData}
        mode={mode}
        isAddMode={isAddMode}
      />
      <FlashMessage
        message={flashMessage}
        type={flashType}
        onClose={handleCloseFlashMessage}
      />
    </>
  );
};

export default Admin;
