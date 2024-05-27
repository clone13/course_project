import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const handleBlock = (userId) => {
    // Block user API call
  };

  const handleUnblock = (userId) => {
    // Unblock user API call
  };

  const handleDelete = (userId) => {
    // Delete user API call
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>
            <input type="checkbox" />
          </th>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Last Login</th>
          <th>Registration Time</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <input type="checkbox" />
            </td>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.lastLogin}</td>
            <td>{user.registrationTime}</td>
            <td>{user.status}</td>
            <td>
              <Button variant="danger" onClick={() => handleBlock(user.id)}>
                Block
              </Button>
              <Button variant="success" onClick={() => handleUnblock(user.id)}>
                Unblock
              </Button>
              <Button variant="primary" onClick={() => handleDelete(user.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserManagement;
