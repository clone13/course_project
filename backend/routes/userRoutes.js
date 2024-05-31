const express = require("express");
const router = express.Router();
const connection = require("../dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Internal server error 0" });
      return;
    }
    res.status(200).json(results);
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const getUserQuery = "SELECT * FROM users WHERE email = ?";
  connection.query(getUserQuery, [email], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "Internal server error 1" });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ message: "Invalid email" });
      return;
    }

    try {
      const user = results[0];

      if (user.status === "inactive") {
        res.status(403).json({
          message: "Your account is inactive. Please contact support.",
        });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ message: "Invalid password" });
        return;
      }

      const secretKey = process.env.JWT_SECRET;
      const token = jwt.sign(
        { email: user.email, role: user.role },
        secretKey,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({ token });
    } catch (error) {
      console.error("Error comparing password:", error);
      res.status(500).json({ message: "Internal server error 3" });
    }
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const userExistsQuery = "SELECT * FROM users WHERE email = ?";
  connection.query(userExistsQuery, [email], async (err, results) => {
    if (err) {
      console.error("Error checking if user exists:", err);
      res.status(500).json({ message: "Internal server error 4" });
      return;
    }

    if (results.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      connection.query(
        insertUserQuery,
        [name, email, hashedPassword],
        (err, results) => {
          if (err) {
            console.error("Error registering user:", err);
            res.status(500).json({ message: "Internal server error 5" });
            return;
          }
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    } catch (error) {
      console.error("Error hashing password:", error);
      res.status(500).json({ message: "Internal server error 6" });
    }
  });
});

router.post("/block/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const sql = "UPDATE users SET status = ? WHERE id = ?";
    const [updateResult] = await connection.query(sql, ["inactive", userId]);

    if (updateResult.affectedRows === 1) {
      res.status(200).json({ message: "User successfully blocked" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error blocking user:", err);
    res.status(500).json({ message: "Internal server error 7" });
  }
});

router.post("/unblock/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const sql = "UPDATE users SET status = ? WHERE id = ?";
    const [updateResult] = await connection.query(sql, ["active", userId]);

    if (updateResult.affectedRows === 1) {
      res.status(200).json({ message: "User successfully unblocked" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error unblocking user:", err);
    res.status(500).json({ message: "Internal server error 8" });
  }
});

router.post("/delete/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const sql = "DELETE FROM users WHERE id = ?";
    const [updateResult] = await connection.query(sql, userId);

    if (updateResult.affectedRows === 1) {
      res.status(200).json({ message: "User successfully deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal server error 9" });
  }
});

router.post("/addAdmin/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const sql = "UPDATE users SET role = ? WHERE id = ?";
    const [updateResult] = await connection.query(sql, ["admin", userId]);

    if (updateResult.affectedRows === 1) {
      res.status(200).json({ message: "User successfully role set admin" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error setting role user:", err);
    res.status(500).json({ message: "Internal server error 10" });
  }
});

router.post("/removeAdmin/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const sql = "UPDATE users SET role = ? WHERE id = ?";
    const [updateResult] = await connection.query(sql, ["user", userId]);

    if (updateResult.affectedRows === 1) {
      res.status(200).json({ message: "User successfully role set user" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error setting role user:", err);
    res.status(500).json({ message: "Internal server error 10" });
  }
});

module.exports = router;
