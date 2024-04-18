const express = require("express");
const mongoose = require("mongoose"); 

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



// Start the server on port 8000
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});