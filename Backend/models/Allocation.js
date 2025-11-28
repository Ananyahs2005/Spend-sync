import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema({
  salary: { type: Number, required: true },
  savingsPercent: { type: Number, default: 20 },
  emergencyPercent: { type: Number, default: 20 },
  groceryPercent: { type: Number, default: 30 },
  enjoymentPercent: { type: Number, default: 30 },
  createdAt: { type: Date, default: Date.now },
});

const Allocation = mongoose.model("Allocation", allocationSchema);

export default Allocation;