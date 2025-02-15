/**
 * Delete before presenting. This code was written by Opemipo for one of my former projects 
 * So, I'm just recycling code here instead of writing from scratch. If you find any private stuff, pls
 * dont..Just forget you saw it and delete it(like password, or sus variable name).
 * You can edit it as you wish, but it has the basic signing-up, and logging-in request handling.
 * I assume we'll need this if we want user-personalized degree Navigation.
 */

const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("bcrypt");//Not sure if it's needed: for encrypting password...
const cors = require("cors");
const sequel = require("mysql2");

const app = express();
const PORT = 3000;//Port number of the server

const path = require("path");


app.use(express.static(path.resolve("")));

app.use(cors()); // Allow requests from frontend
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

//global connection if needed
const connection = sequel.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "",
});


// Handle form submission
app.post("/signup", async (req, res) => {
  let reg = false;
  const remote = sequel.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "DB",
  });
  // Connect to the database
  remote.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    console.log("Connected to the MySQL database!");
  });
  const { netid, email, password, nationality } = req.body;

  if (!netid || !email || !password)
    return res.status(400).json({ message: "Required fields missing!" });

  try {
    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await crypto.hash(password, saltRounds);
    // Put the user into DB
    const query ="INSERT INTO users (netid, email, password, major, classyear, current_year,) VALUES (?, ?, ?, ?, ?, ?, ?)";
    remote.query(
      query,
      [netid, email, hashedPassword, nationality, 2026, "junior", 'D(5)'],//*FIX!!!!
      (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ message: "Username/email already registered" });
        }
        res.status(200).json({ message: "You have successfully registered" });
        reg = true;
        console.log("The value of reg after change is: ", reg);//debug registered and this is redundant
        
        // Performing a query for debugging remove later
        remote.query("SELECT * FROM users", (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          return;
        }
        console.log("Query results:", results);
        });
        remote.end();//End the connection
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
  console.log("New user:", req.body);//Also remove late...just debugging
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
  }
  const remote = sequel.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "SOENav_user_data",
  });

  const query = "SELECT * FROM users WHERE email = ? OR netid = ?";
  remote.query(query, [email, email], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: "Invalid user!" });
      }

      const user = results[0];

      // Compare entered password with hashed password
      crypto.compare(password, user.password, (err, isMatch) => {
          if (err) {
              console.error("Bcrypt error:", err);
              return res.status(500).json({ message: "Authentication error" });
          }

          if (isMatch && user.confirmed) {
              console.log(user.username + " logged in on " + new Date());//Save loggs in a file
              res.status(200).json({ message: "Login successful!", ...user});//spread it from the user object
          } 
          else if(isMatch && !user.confirmed){
              res.status(201).json({ message: "Verify your account in email!" });//change to alsways true in database
          }
          else{
            res.status(401).json({ message: "Invalid password" });
          }

          remote.end();//end the connection
      });
  });
}); 
