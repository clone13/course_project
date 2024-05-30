const express = require("express");
const router = express.Router();
const connection = require("../dbConfig");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM items";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    res.status(200).json(results);
  });
});

router.post("/", (req, res) => {
  const { name, tags, customData, collectionId } = req.body;

  const insertItemQuery =
    "INSERT INTO items (name, tags, customData, collectionId) VALUES (?, ?, ?, ?)";
  connection.query(
    insertItemQuery,
    [name, JSON.stringify(tags), JSON.stringify(customData), collectionId],
    (err, results) => {
      if (err) {
        console.error("Error creating item:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      res.status(201).json({ message: "Item created successfully" });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, tags, customData, collectionId } = req.body;

  const updateItemQuery =
    "UPDATE items SET name = ?, tags = ?, customData = ?, collectionId = ? WHERE id = ?";
  connection.query(
    updateItemQuery,
    [name, JSON.stringify(tags), JSON.stringify(customData), collectionId, id],
    (err, results) => {
      if (err) {
        console.error("Error updating item:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      res.status(200).json({ message: "Item updated successfully" });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const deleteItemQuery = "DELETE FROM items WHERE id = ?";
  connection.query(deleteItemQuery, [id], (err, results) => {
    if (err) {
      console.error("Error deleting item:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    res.status(200).json({ message: "Item deleted successfully" });
  });
});

module.exports = router;
