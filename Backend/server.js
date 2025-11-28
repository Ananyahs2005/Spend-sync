import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

// ✅ MongoDB Connection (merged both URIs)
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/spendsyncDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// =============================================================
// 📘 USER MODEL (from both versions)
// =============================================================
const userSchema = new mongoose.Schema({
  fullname: { type: String },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  salary: { type: Number, default: 0 },
});
const User = mongoose.model("User", userSchema);

// =============================================================
// 💼 SALARY ALLOCATION MODEL
// =============================================================
const allocationSchema = new mongoose.Schema({
  salary: { type: Number, required: true },
  savingsPercent: Number,
  emergencyPercent: Number,
  groceryPercent: Number,
  enjoymentPercent: Number,
});
const Allocation = mongoose.model("Allocation", allocationSchema);

// =============================================================
// 💾 SAVING + SALARY MODELS (merged both versions)
// =============================================================
const salarySchema = new mongoose.Schema({
  email: String,
  salary: Number,
});
const Salary = mongoose.model("Salary", salarySchema);

const savingSchema = new mongoose.Schema({
  email: String,
  totalSalary: { type: Number, default: 0 },
  retirementFund: { type: Number, default: 0 },
  vacationFund: { type: Number, default: 0 },
});
const Saving = mongoose.model("Saving", savingSchema);

// =============================================================
// 🧾 REGISTER ROUTE
// =============================================================
app.post("/api/register", async (req, res) => {
  try {
    console.log("📩 Register request received:", req.body);

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, email, password: hashed });
    await newUser.save();

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// =============================================================
// 🔑 LOGIN ROUTE
// =============================================================
app.post("/api/login", async (req, res) => {
  try {
    console.log("📩 Login request received:", req.body);

    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password || "");
    if (!validPass)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: { fullname: user.fullname, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

// =============================================================
// 💰 SALARY ALLOCATION ROUTES
// =============================================================

// ✅ POST Allocation
app.post("/api/allocate", async (req, res) => {
  try {
    const {
      salary,
      savingsPercent,
      emergencyPercent,
      groceryPercent,
      enjoymentPercent,
    } = req.body;

    const allocation = new Allocation({
      salary,
      savingsPercent,
      emergencyPercent,
      groceryPercent,
      enjoymentPercent,
    });

    await allocation.save();
    res.json({ message: "Salary allocation saved successfully!" });
  } catch (err) {
    console.error("❌ Allocation Error:", err);
    res.status(500).json({ message: "Failed to save allocation" });
  }
});

// ✅ GET Allocation
app.get("/api/allocations", async (req, res) => {
  try {
    const allocation = await Allocation.findOne();
    res.json({ success: true, allocation });
  } catch (err) {
    console.error("❌ Fetch Allocation Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch data" });
  }
});

// ✅ Calculate money for each section
app.post("/allocate-salary", (req, res) => {
  try {
    const { salary, savings, emergency, bills, enjoyment } = req.body;

    if (!salary) return res.status(400).json({ error: "Salary is required" });

    const totalPercentage = savings + emergency + bills + enjoyment;
    if (totalPercentage !== 100) {
      return res
        .status(400)
        .json({ error: "Total percentage must equal 100%" });
    }

    const result = {
      salary,
      savingsAmount: (salary * savings) / 100,
      emergencyFundAmount: (salary * emergency) / 100,
      billsAmount: (salary * bills) / 100,
      enjoymentAmount: (salary * enjoyment) / 100,
    };

    res.json({ message: "Salary split calculated successfully", result });
  } catch (err) {
    console.error("❌ Calculation Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =============================================================
// 📍 DASHBOARD (Save Salary)
// =============================================================
app.post("/dashboard/salary", async (req, res) => {
  console.log("💰 Salary data received:", req.body);
  const { email, salary } = req.body;

  try {
    const newSalary = new Salary({ email, salary });
    await newSalary.save();

    const userSaving = await Saving.findOne({ email });
    if (userSaving) {
      userSaving.totalSalary = salary;
      await userSaving.save();
    } else {
      const newSaving = new Saving({ email, totalSalary: salary });
      await newSaving.save();
    }

    res.status(200).json({ message: "Salary saved successfully" });
  } catch (err) {
    console.error("❌ Error saving salary:", err);
    res.status(500).json({ message: "Server error while saving salary" });
  }
});

// =============================================================
// 📍 SAVING PAGE (Get Total Salary)
// =============================================================
app.get("/saving/:email", async (req, res) => {
  const { email } = req.params;
  console.log(`📤 Fetching saving data for ${email}`);

  try {
    const userSaving = await Saving.findOne({ email });
    if (!userSaving)
      return res
        .status(200)
        .json({ totalSalary: 0, retirementFund: 0, vacationFund: 0 });

    res.status(200).json(userSaving);
  } catch (err) {
    console.error("❌ Error fetching savings:", err);
    res.status(500).json({ message: "Server error while fetching savings" });
  }
});

// =============================================================
// 🚀 Salary Update from Dashboard (from your first code)
// =============================================================
app.post("/updateSalary", async (req, res) => {
  const { email, salary } = req.body;
  try {
    const user = await User.findOneAndUpdate({ email }, { salary }, { new: true });

    let saving = await Saving.findOne({ email });
    if (!saving) {
      saving = new Saving({ email, totalSalary: salary });
    } else {
      saving.totalSalary = salary;
    }
    await saving.save();

    res.json({ message: "✅ Salary updated", salary: user.salary });
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating salary" });
  }
});

// =============================================================
// 💸 Update Savings (Deposit)
// =============================================================
app.post("/updateSaving", async (req, res) => {
  const { email, retirementFund, vacationFund, totalSalary } = req.body;
  try {
    await Saving.findOneAndUpdate(
      { email },
      { retirementFund, vacationFund, totalSalary },
      { new: true, upsert: true }
    );
    res.json({ message: "✅ Savings updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating savings" });
  }
});

// =============================================================
// 💬 LOCAL CHATBOT SECTION (ADDED)
// =============================================================
function generateLocalReply(message) {
  const text = message.toLowerCase();

  if (text.includes("save") || text.includes("saving"))
    return "💰 Save before you spend — treat savings like a bill you must pay yourself.";
  if (text.includes("money"))
    return "💵 Managing money is about mindset — spend less than you earn!";
  if (text.includes("budget"))
    return "📊 Build a simple budget: Income - Expenses = Savings.";
  if (text.includes("investment") || text.includes("invest"))
    return "📈 Start early! Even small investments grow through compounding.";
  if (text.includes("hello") || text.includes("hi"))
    return "👋 Hello! I’m SpendSync Bot — your friendly financial assistant.";

  return "🤔 I’m not sure about that, but I can help you with saving, budgeting, or spending tips!";
}

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    console.log("👤 User Message:", message);
    const reply = generateLocalReply(message);

    res.json({ reply });
  } catch (error) {
    console.error("❌ Chatbot Error:", error.message || error);
    res.status(500).json({ error: "Server Error. Something went wrong." });
  }
});

// =============================================================
// 🚀 START SERVER
// =============================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server & Chatbot running on http://localhost:${PORT}`)
);
