import axios from "axios";

// Simple function, checks for token, fetches data if token exists, uses "data" variable to store data.
// If no token, redirects to sign in page.
export const fetchData = async (mode, setData, navigateTo) => {
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

// Fetches first user if token exists.
export const fetchFirstUser = async (setFirstUser) => {
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

// According to ID, fetches data columns and fetches changes from user text fields.
// This function does not update the data. Only responsible for fetching new data.
// Data updates are implemented on submit.
export const handleUpdate = (
  row,
  setShowModal,
  setCurrentData,
  setIsAddMode,
  mode
) => {
  // When update button is pressed, modal is shown, text fields inside modal set depending on mode.
  setShowModal(true);
  setCurrentData({
    id: row.id,
    input1: mode === "questions" ? row.question : row.username,
    input2: mode === "questions" ? row.answer : row.password,
  });
  setIsAddMode(false); // Set to update mode
};

// Function that handles deleting the data.
export const handleDelete = async (
  row,
  mode,
  firstUser,
  setFlashMessage,
  setFlashType,
  fetchData,
  setData,
  navigateTo
) => {
  // Checks if first user is being deleted and prevents it.
  if (mode === "users" && firstUser && row.id === firstUser.id) {
    setFlashMessage("Default user cannot be deleted.");
    setFlashType("error");
    return; // Return nothing
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
    fetchData(mode, setData, navigateTo); // Responsible for updating table after data update.
  } catch (error) {
    setFlashMessage("Error deleting data.");
    setFlashType("error");
    console.error(`Error deleting ${mode}:`, error);
  }
};

// Function that handles saving changed or added information onClick.
export const handleSave = async (
  updatedData, //updatedData is the row selected.
  mode,
  setFlashMessage,
  setFlashType,
  setShowModal,
  fetchData,
  setData,
  navigateTo
) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (updatedData.id) {
      // If there is an ID fetched, then go to relevant endpoint.
      const endpoint = mode === "questions" ? "update-question" : "update-user";
      const url = `http://127.0.0.1:5000/${endpoint}/${updatedData.id}`;

      await axios.put(
        url,
        {
          // Depending on mode, send required information.
          question: mode === "questions" ? updatedData.input1 : undefined,
          answer: mode === "questions" ? updatedData.input2 : undefined,
          username: mode === "users" ? updatedData.input1 : undefined,
          password: mode === "users" ? updatedData.input2 : undefined,
        },
        { headers }
      );

      setFlashMessage("Data updated successfully.");
      setFlashType("success");
    } else {
      // Same principle as update functionality.
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

      setFlashMessage("Data added successfully.");
      setFlashType("success");
    }

    setShowModal(false);
    fetchData(mode, setData, navigateTo); // Updates table after changes.
  } catch (error) {
    setFlashMessage("Error saving data.");
    setFlashType("error");
    console.error(`Error saving ${mode}:`, error);
  }
};

// Switch between questions and users
export const handleSwitchDatabase = (setMode) => {
  setMode((prevMode) => (prevMode === "questions" ? "users" : "questions"));
}; // Current state is prevMode, depending on current state/database, switches to other database on click.

// Log out and redirect to sign-in page
export const handleLogOut = (navigateTo) => {
  localStorage.removeItem("token");
  navigateTo("/signin");
};
