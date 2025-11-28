const mongoose = require("mongoose");

const enjoymentSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enjoyment", enjoymentSchema);
