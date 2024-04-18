const express = require("express");
const mongoose = require("mongoose"); 
const bcrypt = require("bcryptjs");

const userModel = require("./models/userModel");

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

// Start the server on port 8000
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});