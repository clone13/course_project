import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserPage = () => {
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    category: "",
    customFields: [],
  });
  const [newItem, setNewItem] = useState({
    name: "",
    tags: [],
    customData: {},
    collectionId: null,
  });
  const history = useHistory();

  useEffect(() => {
    const fetchCollectionsAndItems = async () => {
      try {
        const collectionsResponse = await axios.get(
          "https://course-project-wk3m.onrender.com/api/collections"
        );
        setCollections(collectionsResponse.data);

        const itemsResponse = await axios.get(
          "https://course-project-wk3m.onrender.com/api/items"
        );
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCollectionsAndItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    history.push("/");
  };

  const handleCollectionChange = (e) => {
    const { name, value } = e.target;
    setNewCollection({ ...newCollection, [name]: value });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://course-project-wk3m.onrender.com/api/collections/create/",
        newCollection
      );
      setNewCollection({
        name: "",
        description: "",
        category: "",
        customFields: [],
      });
      const collectionsResponse = await axios.get(
        "https://course-project-wk3m.onrender.com/api/collections"
      );
      setCollections(collectionsResponse.data);
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://course-project-wk3m.onrender.com/api/items/create/",
        newItem
      );
      setNewItem({ name: "", tags: [], customData: {}, collectionId: null });
      const itemsResponse = await axios.get(
        "https://course-project-wk3m.onrender.com/api/items"
      );
      setItems(itemsResponse.data);
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  return (
    <div className="user-page">
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
              <li className="nav-item">
                <Link className="btn btn-primary nav-link" to="/usermanagement">
                  Admin
                </Link>
              </li>
              <li>
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
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <h1>User Page</h1>
        <div className="row">
          <div className="col-md-6">
            <h2>Create Collection</h2>
            <form onSubmit={handleCollectionSubmit}>
              <div className="mb-3">
                <label htmlFor="collectionName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="collectionName"
                  name="name"
                  value={newCollection.name}
                  onChange={handleCollectionChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="collectionDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="collectionDescription"
                  name="description"
                  value={newCollection.description}
                  onChange={handleCollectionChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="collectionCategory" className="form-label">
                  Category
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="collectionCategory"
                  name="category"
                  value={newCollection.category}
                  onChange={handleCollectionChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Create Collection
              </button>
            </form>
          </div>
          <div className="col-md-6">
            <h2>Create Item</h2>
            <form onSubmit={handleItemSubmit}>
              <div className="mb-3">
                <label htmlFor="itemName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="itemName"
                  name="name"
                  value={newItem.name}
                  onChange={handleItemChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="itemTags" className="form-label">
                  Tags
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="itemTags"
                  name="tags"
                  value={newItem.tags}
                  onChange={handleItemChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="itemCollectionId" className="form-label">
                  Collection
                </label>
                <select
                  className="form-select"
                  id="itemCollectionId"
                  name="collectionId"
                  value={newItem.collectionId}
                  onChange={handleItemChange}
                  required
                >
                  <option value="">Select a collection</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Create Item
              </button>
            </form>
          </div>
        </div>

        <h2 className="mt-4">My Collections</h2>
        <div className="collections">
          {collections.map((collection) => (
            <div key={collection.id} className="collection mb-4">
              <h3>{collection.name}</h3>
              <p>{collection.description}</p>
              <h4>Items:</h4>
              <ul>
                {items
                  .filter((item) => item.collectionId === collection.id)
                  .map((item) => (
                    <li key={item.id}>
                      <strong>{item.name}</strong>: {item.tags.join(", ")}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
