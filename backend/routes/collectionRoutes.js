const express = require("express");
const router = express.Router();
const connection = require("../dbConfig");

router.get("/", (req, res) => {
  const sql = `
  SELECT 
  collections.id, 
  collections.name, 
  collections.description, 
  items.id AS item_id, 
  items.NAME AS item_name
FROM 
  collections
LEFT JOIN 
  items ON items.collectionId = collections.id;
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
          items: row.item_id
            ? [
                {
                  id: row.item_id,
                  name: row.item_name,
                  description: row.item_description,
                },
              ]
            : [],
        });
      } else {
        if (row.item_id) {
          acc[collectionIndex].items.push({
            id: row.item_id,
            name: row.item_name,
            description: row.item_description,
          });
        }
      }

      return acc;
    }, []);

    res.status(200).json(collections);
  });
});

module.exports = router;
