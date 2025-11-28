const mongoose = require("mongoose");

const grocerySchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Grocery", grocerySchema);
