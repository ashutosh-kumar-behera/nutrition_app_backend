const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    foodID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foods",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
  },
  { timestamps: true }
);

const trackingModel = mongoose.model("tracks", trackingSchema);

module.exports = trackingModel;
