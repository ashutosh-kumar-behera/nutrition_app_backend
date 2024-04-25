const mongoose = require("mongoose");

// Define the schema for tracking food consumption
const trackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Assuming there is a User model with which to associate
      required: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foods", // Assuming there is a Food model with which to associate
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Minimum quantity set to 1
    },
    eatenDate: {
      type: Date,
      default: Date.now() // Set default to the current date and time
    },
  },
  { timestamps: true }
);

// Create the model from the schema
const trackingModel = mongoose.model("trackings", trackingSchema);

module.exports = trackingModel;
