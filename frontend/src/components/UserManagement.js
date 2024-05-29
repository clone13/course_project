import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Toolbar from "./Toolbar";

const UserManagement = () => {
  const [whoIsUser, setWhoIsUser] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://login-application-backend.onrender.com/api/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Fetch users when the component mounts
  }, []);

  useEffect(() => {
    const userChecker = () => {
      const userEmail = localStorage.getItem("userEmail");
      const foundUser = users.find((item) => item.email === userEmail);
      if (foundUser) {
        const { name, status } = foundUser;
        setWhoIsUser(name);
        if (status === "blocked") {
          setWhoIsUser("");
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
        }
      }
    };
    userChecker();
  });

  const handleCheckboxChange = (userId, isChecked) => {
    const newSelectedUsers = [...selectedUsers];

    if (isChecked) {
      newSelectedUsers.push(userId);
    } else {
      const indexToRemove = newSelectedUsers.indexOf(userId);
      if (indexToRemove !== -1) {
        newSelectedUsers.splice(indexToRemove, 1);
      }
    }

    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectAll = (isChecked) => {
    setSelectedUsers(isChecked ? users.map((user) => user.id) : []);
  };

  const handleBlock = async () => {
    for (let i = 0; i < selectedUsers.length; i++) {
      try {
        const element = selectedUsers[i];
        await axios.post(
          `https://login-application-backend.onrender.com/api/users/block/${element}`
        );
        console.log(`User(s) with ID(s) ${element} blocked successfully.`);
        const updatedUsers = users.map((user) =>
          selectedUsers.includes(user.id)
            ? { ...user, status: "blocked" }
            : user
        );
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error blocking user(s):", error);
        // Refetch data if blocking fails
        const response = await axios.get(
          "https://login-application-backend.onrender.com/api/users"
        );
        setUsers(response.data);
      }
    }
  };

  const handleUnblock = async () => {
    for (let i = 0; i < selectedUsers.length; i++) {
      try {
        const element = selectedUsers[i];
        await axios.post(
          `https://login-application-backend.onrender.com/api/users/unblock/${element}`
        );
        console.log(`User(s) with ID(s) ${element} unblocked successfully.`);

        const updatedUsers = users.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, status: "active" } : user
        );
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error unblocking user(s):", error);
        // Refetch data if unblocking fails
        const response = await axios.get(
          "https://login-application-backend.onrender.com/api/users"
        );
        setUsers(response.data);
      }
    }
  };

  const handleDelete = async () => {
    for (let i = 0; i < selectedUsers.length; i++) {
      try {
        const element = selectedUsers[i];
        await axios.post(
          `https://login-application-backend.onrender.com/api/users/delete/${element}`
        );
        console.log(`User(s) with ID(s) ${element} deleted successfully.`);
        setSelectedUsers([]);
        const updatedUsers = users.filter(
          (user) => !selectedUsers.includes(user.id)
        ); // Filter out deleted users
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error deleting user(s):", error);
        // Refetch data if deletion fails
        const response = await axios.get(
          "https://login-application-backend.onrender.com/api/users"
        );
        setUsers(response.data);
      }
    }
  };

  const handleSortByName = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (nameA > nameB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    setUsers(sortedUsers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const logOutHandler = () => {
    history.push("/");
    setWhoIsUser("");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
  };

  // if (localStorage.getItem("emailInput")) {
  //   setWhoIsUser(localStorage.getItem("emailInput"));
  // }

  // if (localStorage.getItem("emailInput")) {
  //   localStorage.removeItem("token");
  // }

  return (
    <div className="my-div">
      <div className="navbar navbar-expand-lg bg-light ">
        <div className="container justify-content-end">
          <div className="me-2">
            Hello, <b>{whoIsUser}</b> !
          </div>
          <button className="btn btn-link" onClick={logOutHandler}>
            Logout
          </button>
        </div>
      </div>
      <div className="container">
        <div className=" mt-3">
          <div>
            <h2>User Management</h2>
            <div style={{ margin: "30px" }}>
              <Toolbar
                onBlock={handleBlock}
                onUnblock={handleUnblock}
                onDelete={handleDelete}
              />
            </div>
            <table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length} // Check if all selected
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th onClick={handleSortByName} style={{ cursor: "pointer" }}>
                    Name {sortOrder === "asc" ? "▲" : "▼"}
                  </th>
                  <th>Email</th>
                  <th>Last Login</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) =>
                          handleCheckboxChange(user.id, e.target.checked)
                        }
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.last_login_time}</td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Display selected user IDs or perform actions based on selection (optional) */}
            {selectedUsers.length > 0 && (
              <p>Selected user IDs: {selectedUsers.join(", ")}</p>
            )}{" "}
            {/* Display selected IDs */}
            {/* You can add a button or functionality to handle the selected user IDs here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
