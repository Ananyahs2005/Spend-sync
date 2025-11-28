const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Emergency", emergencySchema);
