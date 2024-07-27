import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import FilterComponent, {
  useFilter,
} from "../../Components/FilterComponent/FilterComponent";
import FlashMessage from "../../Components/FlashMessage/FlashMessage"; // Import FlashMessage
import "./Admin.css";
import { useNavigate } from "react-router-dom";

const Modal = ({ show, onClose, onSave, data, mode, isAddMode }) => {
  const [input1, setInput1] = useState(data.input1 || "");
  const [input2, setInput2] = useState(data.input2 || "");

  useEffect(() => {
    setInput1(data.input1 || "");
    setInput2(data.input2 || "");
  }, [data]);

  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: data.id, input1, input2 }); // Make sure to pass the id
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modalHeader">
          <h2>
            {isAddMode
              ? mode === "questions"
                ? "Add Question"
                : "Add User"
              : mode === "questions"
              ? "Update Question"
              : "Update User"}
          </h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <form onSubmit={handleSubmit} className="formContent">
          <div className="form-group">
            <label>{mode === "questions" ? "Question" : "User"}</label>
            <input
              type="text"
              value={input1}
              placeholder={mode === "questions" ? "Question" : "User"}
              onChange={(e) => setInput1(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{mode === "questions" ? "Answer" : "Password"}</label>
            <input
              type="text"
              value={input2}
              placeholder={mode === "questions" ? "Answer" : "Password"}
              onChange={(e) => setInput2(e.target.value)}
            />
          </div>
          <div className="buttonContainer">
            <button type="submit" className="adminSubmit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Admin = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [mode, setMode] = useState("questions");
  const [flashMessage, setFlashMessage] = useState(""); // Flash message state
  const [flashType, setFlashType] = useState("success"); // Flash message type
  const [firstUser, setFirstUser] = useState(null); // State to store the first user
  const [isAddMode, setIsAddMode] = useState(true); // State to determine add or update mode
  const navigateTo = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigateTo("/signin");
    } else {
      fetchData();
      if (mode === "users") {
        fetchFirstUser();
      }
    }
  }, [mode]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`http://127.0.0.1:5000/fetch-${mode}`, {
        headers,
      });
      const data = response.data.data;
      setData(data);
    } catch (error) {
      console.error(`Error fetching ${mode}:`, error);
      if (error.response && error.response.status === 401) {
        navigateTo("/signin");
      }
    }
  };

  const fetchFirstUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get("http://127.0.0.1:5000/fetch-users", {
        headers,
      });
      if (response.data.data.length > 0) {
        setFirstUser(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching the first user:", error);
    }
  };

  const handleUpdate = (row) => {
    setShowModal(true);
    setCurrentData({
      id: row.id,
      input1: mode === "questions" ? row.question : row.username,
      input2: mode === "questions" ? row.answer : row.password,
    });
    setIsAddMode(false); // Set to update mode
  };

  const handleDelete = async (row) => {
    if (mode === "users" && firstUser && row.id === firstUser.id) {
      setFlashMessage("Default user cannot be deleted.");
      setFlashType("error");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.delete(`http://127.0.0.1:5000/delete-${mode}/${row.id}`, {
        headers,
      });
      setFlashMessage("Data deleted successfully.");
      setFlashType("success");
      fetchData();
    } catch (error) {
      setFlashMessage("Error deleting data.");
      setFlashType("error");
      console.error(`Error deleting ${mode}:`, error);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      // Check if ID is present for update, otherwise, add new entry
      if (updatedData.id) {
        const endpoint =
          mode === "questions" ? "update-question" : "update-user";
        const url = `http://127.0.0.1:5000/${endpoint}/${updatedData.id}`;

        await axios.put(
          url,
          {
            question: mode === "questions" ? updatedData.input1 : undefined,
            answer: mode === "questions" ? updatedData.input2 : undefined,
            username: mode === "users" ? updatedData.input1 : undefined,
            password: mode === "users" ? updatedData.input2 : undefined,
          },
          { headers }
        );

        setFlashMessage("Data updated successfully."); // Set flash message
        setFlashType("success");
      } else {
        const endpoint = mode === "questions" ? "add-question" : "add-user";
        const url = `http://127.0.0.1:5000/${endpoint}`;

        await axios.post(
          url,
          {
            question: mode === "questions" ? updatedData.input1 : undefined,
            answer: mode === "questions" ? updatedData.input2 : undefined,
            username: mode === "users" ? updatedData.input1 : undefined,
            password: mode === "users" ? updatedData.input2 : undefined,
          },
          { headers }
        );

        setFlashMessage("Data added successfully."); // Set flash message
        setFlashType("success");
      }

      setShowModal(false);
      fetchData(); // Refresh data after save
    } catch (error) {
      setFlashMessage("Error saving data."); // Set flash message
      setFlashType("error");
      console.error(`Error saving ${mode}:`, error);
    }
  };

  const handleAdd = () => {
    setShowModal(true);
    setCurrentData({ id: null, input1: "", input2: "" });
    setIsAddMode(true); // Set to add mode
  };

  const handleSwitchDatabase = () => {
    setMode((prevMode) => (prevMode === "questions" ? "users" : "questions"));
  };

  const handleCloseFlashMessage = () => {
    setFlashMessage("");
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigateTo("/signin");
  };

  const filteredData = useFilter(data, filterText);

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
            <button onClick={() => handleUpdate(row)}>Update</button>
            <button onClick={() => handleDelete(row)}>Delete</button>
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
          <button onClick={handleSwitchDatabase} className="switchButton">
            Switch Database
          </button>
          <div className="buttonSeparator" />
          <div className="databaseControl">
            <button onClick={handleAdd}>Add</button>
            <button> Import data </button>
            <button> Export data </button>
          </div>
          <div className="buttonSeparator" />
          <button onClick={handleLogOut} className="switchButton">
            {" "}
            Logout{" "}
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
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        data={currentData}
        mode={mode}
        isAddMode={isAddMode} // Pass isAddMode to Modal
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
