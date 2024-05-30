import { useState, useEffect } from "react";
import axios from "axios";

const ItemForm = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);
  const [customData, setCustomData] = useState({});
  const [collectionId, setCollectionId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/items", {
        name,
        tags,
        customData,
        collectionId,
      });

      setMessage("Item created successfully");
      setItems([...items, response.data]);
    } catch (error) {
      console.error("Error creating item:", error);
      setMessage("Failed to create item");
    }
  };

  return (
    <div>
      <h2>Create an Item</h2>
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
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value.split(","))}
          required
        />
        <input
          type="text"
          placeholder="Custom Data (JSON)"
          value={JSON.stringify(customData)}
          onChange={(e) => setCustomData(JSON.parse(e.target.value))}
          required
        />
        <input
          type="text"
          placeholder="Collection ID"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          required
        />
        <button type="submit">Create Item</button>
      </form>
      {message && <p>{message}</p>}
      <h2>Existing Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.tags.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemForm;
