const mongoose = require("mongoose");

const savingSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Saving", savingSchema);
