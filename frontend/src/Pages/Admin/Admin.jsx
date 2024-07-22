import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import FilterComponent, {
  useFilter,
} from "../../Components/FilterComponent/FilterComponent";
import "./Admin.css";

const Modal = ({ show, onClose, onSave, data, mode }) => {
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
    onSave({ id: data.id, input1, input2 });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{mode === "questions" ? "Update Question" : "Update User"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{mode === "questions" ? "Question" : "Username"}</label>
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{mode === "questions" ? "Answer" : "Password"}</label>
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>
            Close
          </button>
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

  useEffect(() => {
    fetchData();
  }, [mode]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/fetch-${mode}`);
      const data = response.data.data;
      setData(data);
    } catch (error) {
      console.error(`Error fetching ${mode}:`, error);
    }
  };

  const handleUpdate = (row) => {
    setShowModal(true);
    setCurrentData({
      id: row.id,
      input1: mode === "questions" ? row.question : row.username,
      input2: mode === "questions" ? row.answer : row.password,
    });
  };

  const handleDelete = async (row) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete-${mode}/${row.id}`);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error(`Error deleting ${mode}:`, error);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      const endpoint = mode === "questions" ? "update-question" : `update-user`;
      const url =
        mode === "questions"
          ? `http://127.0.0.1:5000/${endpoint}/${updatedData.id}`
          : `http://127.0.0.1:5000/${endpoint}/${currentData.input1}`;

      await axios.put(url, {
        question: mode === "questions" ? updatedData.input1 : undefined,
        answer: mode === "questions" ? updatedData.input2 : undefined,
        username: mode === "users" ? updatedData.input1 : undefined,
        password: mode === "users" ? updatedData.input2 : undefined,
      });

      setShowModal(false);
      fetchData(); // Refresh data after update
    } catch (error) {
      console.error(`Error updating ${mode}:`, error);
    }
  };

  const handleAdd = async () => {
    setShowModal(true);
    setCurrentData({ id: null, input1: "", input2: "" });
  };

  const handleSwitchDatabase = () => {
    setMode((prevMode) => (prevMode === "questions" ? "users" : "questions"));
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
          <button onClick={() => handleUpdate(row)}>Update</button>
          <button onClick={() => handleDelete(row)}>Delete</button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "20%",
    },
  ];

  return (
    <div>
      <div className="adminHeader">
        <FilterComponent
          filterText={filterText}
          onFilter={(e) => setFilterText(e.target.value)}
        />
      </div>
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleSwitchDatabase}>Switch Database</button>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        dense
      />
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        data={currentData}
        mode={mode}
      />
    </div>
  );
};

export default Admin;
