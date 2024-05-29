import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const RegistrationForm = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  const handleClickRoute = () => {
    history.push("/login");
  };

  const handleHistory = () => {
    history.push("/usermanagement");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://login-application-backend.onrender.com/api/users/register",
        {
          name: name,
          email: email,
          password: password,
        }
      );
      localStorage.setItem("userEmail", email);
      console.log(response.data);
      handleHistory();
    } catch (error) {
      // Handle error
      setErrorMessage(error.response.data.message);
      // You can display an error message to the user
    }
  };

  return (
    <div className="loginForm">
      <h2 className="form_text">Registration Form</h2>
      <form className="form" onSubmit={handleRegister}>
        <input
          className="form-control form-outline mb-4"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-control form-outline mb-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-control form-outline mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-success btn-block mb-4">
          Register
        </button>
        <div className="linkForm">
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <p>If you have an account</p>
          <button className="btn btn-link" onClick={handleClickRoute}>
            LOG IN
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
