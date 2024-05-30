import React, { useState, useEffect } from "react";
import axios from "axios";

const CollectionForm = () => {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [customFields, setCustomFields] = useState({});
  const [authorId, setAuthorId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "https://course-project-wk3m.onrender.com/api/collections"
        );
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://course-project-wk3m.onrender.com/api/collections",
        {
          name,
          description,
          category,
          imageUrl,
          customFields,
          authorId,
        }
      );

      setMessage("Collection created successfully");
      setCollections([...collections, response.data]);
    } catch (error) {
      console.error("Error creating collection:", error);
      setMessage("Failed to create collection");
    }
  };

  return (
    <div>
      <h2>Create a Collection</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom Fields (JSON)"
          value={JSON.stringify(customFields)}
          onChange={(e) => setCustomFields(JSON.parse(e.target.value))}
          required
        />
        <input
          type="text"
          placeholder="Author ID"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          required
        />
        <button type="submit">Create Collection</button>
      </form>
      {message && <p>{message}</p>}
      <h2>Existing Collections</h2>
      <ul>
        {collections.map((collection) => (
          <li key={collection.id}>
            {collection.name} - {collection.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionForm;
