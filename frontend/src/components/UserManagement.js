import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://course-project-wk3m.onrender.com/api/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const userChecker = () => {
      const userEmail = localStorage.getItem("userEmail");
      const foundUser = users.find((item) => item.email === userEmail);
      if (foundUser) {
        const { name, status } = foundUser;
        localStorage.setItem("userName", name);
        if (status === "blocked") {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          localStorage.removeItem("userEmail");
        }
      }
    };
    userChecker();
  }, [users]);

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
          `https://course-project-wk3m.onrender.com/api/users/block/${element}`
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
        const response = await axios.get(
          "https://course-project-wk3m.onrender.com/api/users"
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
          `https://course-project-wk3m.onrender.com/api/users/unblock/${element}`
        );
        console.log(`User(s) with ID(s) ${element} unblocked successfully.`);

        const updatedUsers = users.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, status: "active" } : user
        );
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error unblocking user(s):", error);
        const response = await axios.get(
          "https://course-project-wk3m.onrender.com/api/users"
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
          `https://course-project-wk3m.onrender.com/api/users/delete/${element}`
        );
        console.log(`User(s) with ID(s) ${element} deleted successfully.`);
        setSelectedUsers([]);
        const updatedUsers = users.filter(
          (user) => !selectedUsers.includes(user.id)
        );
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error deleting user(s):", error);
        const response = await axios.get(
          "https://course-project-wk3m.onrender.com/api/users"
        );
        setUsers(response.data);
      }
    }
  };

  const handleAddAdmin = async () => {
    for (let i = 0; i < selectedUsers.length; i++) {
      try {
        const element = selectedUsers[i];
        await axios.post(
          `https://course-project-wk3m.onrender.com/api/users/addAdmin/${element}`
        );
        console.log(`User(s) with ID(s) ${element} granted admin access.`);
        const updatedUsers = users.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, role: "admin" } : user
        );
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error adding admin access to user(s):", error);
        const response = await axios.get(
          "https://course-project-wk3m.onrender.com/api/users"
        );
        setUsers(response.data);
      }
    }
  };

  const handleRemoveAdmin = async () => {
    for (let i = 0; i < selectedUsers.length; i++) {
      try {
        const element = selectedUsers[i];
        await axios.post(
          `https://course-project-wk3m.onrender.com/api/users/removeAdmin/${element}`
        );
        console.log(`User(s) with ID(s) ${element} admin access removed.`);
        const updatedUsers = users.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, role: "user" } : user
        );
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error removing admin access from user(s):", error);
        const response = await axios.get(
          "https://course-project-wk3m.onrender.com/api/users"
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
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
  };

  return (
    <div className="my-div">
      <div className="navbar navbar-expand-lg bg-light">
        <div className="container justify-content-space-between">
          <div className="me-2">
            Hello, <b>{localStorage.getItem("userName")}</b>!
          </div>
          <div className="d-flex">
            <div>
              <Link to="/home" className="btn btn-primary mb-3 nav-link">
                Home
              </Link>
            </div>
            <div>
              <button
                className="btn btn-primary nav-link"
                onClick={logOutHandler}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="mt-3">
          <h2>User Management</h2>
          <div className="mb-3">
            <button className="btn btn-success me-2" onClick={handleAddAdmin}>
              Add Admin
            </button>
            <button
              className="btn btn-warning me-2"
              onClick={handleRemoveAdmin}
            >
              Remove Admin
            </button>
            <button className="btn btn-danger me-2" onClick={handleBlock}>
              Block
            </button>
            <button className="btn btn-primary me-2" onClick={handleUnblock}>
              Unblock
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th onClick={handleSortByName} style={{ cursor: "pointer" }}>
                  Name {sortOrder === "asc" ? "▲" : "▼"}
                </th>
                <th>Email</th>
                <th>Last Login</th>
                <th>Role</th>
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
                  <td>{new Date(user.updated_at).toLocaleString()}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedUsers.length > 0 && (
            <p>Selected user IDs: {selectedUsers.join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
