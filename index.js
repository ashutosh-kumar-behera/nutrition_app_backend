const express = require("express");
const mongoose = require("mongoose"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("./models/userModel");
const foodModel = require("./models/foodModel");
const verifyToken = require("./verifyToken");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/nutrify")
  .then(() => {
    // Connection successful
    console.log("Database connection successful");
  })
  .catch((err) => {
    // Connection failed
    console.error("Database connection error:", err);
  });

// Initialize Express app
const app = express();
// Use express.json() middleware for parsing JSON bodies
app.use(express.json());

// POST endpoint for user register
app.post("/register", async (req, res) => {
  // Destructure the user object from the request body
  const { name, email, password, age } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object with the hashed password
    const newUser = { name, email, password: hashedPassword, age };

    // Save the new user to the database
    const data = await userModel.create(newUser);

    // Send a success response
    res.status(201).send({ message: "Register successful", userId: data._id });
  } catch (err) {
    // Send an error response
    res
      .status(500)
      .send({ message: "Something went wrong", error: err.message });
  }
});

// POST endpoint for user login
app.post("/login", async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body;

  try {
    // Attempt to find the user by email
    const user = await userModel.findOne({ email });
    // If user is not found, send a 404 response
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    // If the password doesn't match, send a 401 response
    if (!isMatch) {
      return res.status(401).send({ message: "Incorrect Password" });
    }

    // If the password matches, sign a new token with the user's email and a 1-hour expiration
    const token = jwt.sign({ email }, "nutrifyApp", {
      expiresIn: "1h",
    });

    // Send a success response with the login message, token, and user details
    res.send({
      message: "Login Success",
      token,
      userId: user._id,
      name: user.name,
    });
  } catch (err) {
    // If an error occurs, send a 500 response with the error message
    res.status(500).send({ message: "Some Problem", error: err.message });
  }
});

// GET endpoint to retrieve all foods
app.get("/foods", verifyToken, async (req, res) => {
  try {
    // Attempt to find all food documents in the database
    const foods = await foodModel.find();
    // If successful, send the foods array in the response
    res.send({ foods });
  } catch (err) {
    // If an error occurs, log the error and send a 500 status code with a message
    console.error("Error fetching foods:", err);
    res.status(500).send({ message: "Unable to retrieve items" });
  }
});


// Start the server on port 8000
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});