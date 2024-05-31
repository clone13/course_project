const express = require("express");
const router = express.Router();
const connection = require("../dbConfig");

router.get("/", (req, res) => {
  const sql = `
    SELECT collections.id, collections.name, collections.description, collections.category, collections.imageUrl, collections.customFields, collections.authorId,
           items.id AS item_id, items.name AS item_name, items.tags AS item_tags, items.customData AS item_customData
    FROM collections
    LEFT JOIN items ON items.collectionId = collections.id
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching collections:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const collections = results.reduce((acc, row) => {
      const collectionIndex = acc.findIndex(
        (collection) => collection.id === row.id
      );

      if (collectionIndex === -1) {
        acc.push({
          id: row.id,
          name: row.name,
          description: row.description,
          category: row.category,
          imageUrl: row.imageUrl,
          customFields: row.customFields,
          authorId: row.authorId,
          items: row.item_id
            ? [
                {
                  id: row.item_id,
                  name: row.item_name,
                  tags: JSON.parse(row.item_tags),
                  customData: JSON.parse(row.item_customData),
                },
              ]
            : [],
        });
      } else {
        if (row.item_id) {
          acc[collectionIndex].items.push({
            id: row.item_id,
            name: row.item_name,
            tags: JSON.parse(row.item_tags),
            customData: JSON.parse(row.item_customData),
          });
        }
      }

      return acc;
    }, []);

    res.status(200).json(collections);
  });
});

// Create a new collection
router.post("/create", (req, res) => {
  const { name, description, category, imageUrl, customFields, authorId } =
    req.body;

  const insertCollectionQuery = `
    INSERT INTO collections (name, description, category, imageUrl, customFields, authorId)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    insertCollectionQuery,
    [
      name,
      description,
      category,
      imageUrl,
      JSON.stringify(customFields),
      authorId,
    ],
    (err, results) => {
      if (err) {
        console.error("Error creating collection:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      res.status(201).json({ message: "Collection created successfully" });
    }
  );
});

// Update a collection
router.put("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, category, imageUrl, customFields, authorId } =
    req.body;

  const updateCollectionQuery = `
    UPDATE collections SET name = ?, description = ?, category = ?, imageUrl = ?, customFields = ?, authorId = ? WHERE id = ?
  `;

  connection.query(
    updateCollectionQuery,
    [
      name,
      description,
      category,
      imageUrl,
      JSON.stringify(customFields),
      authorId,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating collection:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      res.status(200).json({ message: "Collection updated successfully" });
    }
  );
});

// Delete a collection
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  const deleteCollectionQuery = "DELETE FROM collections WHERE id = ?";
  connection.query(deleteCollectionQuery, [id], (err, results) => {
    if (err) {
      console.error("Error deleting collection:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    res.status(200).json({ message: "Collection deleted successfully" });
  });
});

module.exports = router;
