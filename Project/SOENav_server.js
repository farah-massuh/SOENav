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
  host: "bmu76n1mf2sehxodofjl-mysql.services.clever-cloud.com",
  user: "udaban8ouzufgby5",
  password: "xH67BYKcnsZq9J0vUVvO",
  database: "bmu76n1mf2sehxodofjl",
});


// Handle form submission
app.post("/signup", async (req, res) => {
  let reg = false;
  const remote = sequel.createConnection({
    host: "bmu76n1mf2sehxodofjl-mysql.services.clever-cloud.com",
  user: "udaban8ouzufgby5",
  password: "xH67BYKcnsZq9J0vUVvO",
  database: "bmu76n1mf2sehxodofjl"
  });
  // Connect to the database
  remote.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    console.log("Connected to the MySQL database!");
  });
  const {name, netid, email, password, matric, gradDate, major,coursesTaken } = req.body;
  console.log("New user:", req.body);//Also remove late...just debugging

  if (!name || !netid || !email || !password)
    return res.status(400).json({success: false, message: "Required fields missing!" });

  try {
    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await crypto.hash(password, saltRounds);
    // Put the user into DB
    const query = `INSERT INTO soenav_students ( name, email, netID, password, matricDate, expectedGradDate, currentSchoolYear, major, coursesTaken
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    remote.query(
      query,
      [name, email, netid, hashedPassword, matric, gradDate, 'junior', major, coursesTaken],//*FIX!!!!
      (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({success: false, message: "Username/email already registered" });
        }
        res.status(200).json({success: true, message: "You have successfully registered" });
        reg = true;
        console.log("The value of reg after change is: ", reg);//debug registered and this is redundant
        
        // Performing a query for debugging remove later
        remote.query("SELECT * FROM soenav_students", (err, results) => {
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
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
  }
  const remote = sequel.createConnection({
    host: "bmu76n1mf2sehxodofjl-mysql.services.clever-cloud.com",
  user: "udaban8ouzufgby5",
  password: "xH67BYKcnsZq9J0vUVvO",
  database: "bmu76n1mf2sehxodofjl"
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

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
