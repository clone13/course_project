const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.register = (req, res) => {
  console.log(req.body);

  const { name, email, password, checkbox } = req.body;

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      }
      if (result.length > 0) {
        console.log("this email is already registered");
      } else if (password.length <= 8) {
        console.log("your password is too short");
        // return res.render("register", {
        //   message: "password is too short",
        // });
      }

      let hashedPassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO users SET ?",
        {
          name: name,
          email: email,
          password: hashedPassword,
          status: "active",
        },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log("User stored to data !!!");
          }
        }
      );
    }
  );
};
