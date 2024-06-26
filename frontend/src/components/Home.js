import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "https://course-project-wk3m.onrender.com/api/collections"
        );
        setCollections(response.data);
      } catch (error) {
        setError("Error fetching collections. Please try again later.");
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    history.push("/");
  };

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          {
            <div className="me-2">
              {localStorage.getItem("userName") === "" ? (
                <div>NO USER</div>
              ) : (
                <div>
                  Hello, <b>{localStorage.getItem("userName")}</b>!
                </div>
              )}
            </div>
          }
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="btn btn-primary nav-link" to="/user">
                      User Page
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-primary nav-link" to="/home">
                      Home
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button
                      className="btn btn-primary nav-link"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="btn btn-primary nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <h1>Welcome to Our Collections</h1>
        {error && <p className="text-danger">{error}</p>}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="collections">
          {filteredCollections.map((collection) => (
            <div key={collection.id} className="collection mb-4">
              <h2>{collection.name}</h2>
              <p>{collection.description}</p>
              <div className="items">
                {collection.items.map((item) => (
                  <div key={item.id} className="item">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
