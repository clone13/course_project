import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backendError, setBackendError] = useState("");

  const history = useHistory();

  const handleClickRoute = () => {
    history.push("/registration");
  };

  const handleHistory = () => {
    history.push("/usermanagement");
  };

  const getEmail = () => {
    localStorage.setItem("userEmail", email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setBackendError("Please fill your email.");
      return;
    }

    try {
      const response = await axios.post(
        "https://course-project-wk3m.onrender.com/api/users/login/",
        {
          email,
          password,
        }
      );

      const { token } = response.data;
      localStorage.setItem("token", token);
      // window.location.href = "/usermanagement";
      handleHistory();
    } catch (error) {
      if (error.response && error.response.data) {
        setBackendError(error.response.data.message);
      } else {
        console.error("An error occurred:", error.message);
        setBackendError("An error occurred. Please check the server.");
      }
    }
  };

  return (
    <>
      <div className="loginForm">
        <h2 className="form_text">Login</h2>
        <div className="form-group">
          <form className="form" onSubmit={handleLogin}>
            <div data-mdb-input-init className=" form-outline mb-4">
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div data-mdb-input-init className=" form-outline mb-4">
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              onClick={getEmail}
              type="submit"
              className="btn btn-primary btn-block mb-4 "
            >
              Sign in
            </button>
          </form>
        </div>
        {backendError && <p className="text-danger">{backendError}</p>}
        <div>
          <button className="btn btn-link" onClick={handleClickRoute}>
            REGISTRATION
          </button>
          <Link className="nav-link btn btn-link" to="/home">
            Home Page
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
