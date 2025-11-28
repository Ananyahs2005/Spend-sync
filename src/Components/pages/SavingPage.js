import React, { useState, useEffect } from "react";
import "./SavingPage.css";

const SavingPage = ({ goals = [], onWithdrawal }) => {
  const [isWithdrawalMode, setIsWithdrawalMode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [emergencyReason, setEmergencyReason] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [totalSalary, setTotalSalary] = useState(0);

  // ✅ Load user email and salary from localStorage (no backend)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const salaryData = JSON.parse(localStorage.getItem("salaryData"));

    if (user && user.email) setEmail(user.email);
    if (salaryData && salaryData.salary) setTotalSalary(salaryData.salary);
  }, []);

  // ⚠ Handle critical withdrawal start
  const handleCriticalWithdrawal = () => {
    if (
      window.confirm(
        "⚠ WARNING: This withdrawal is subject to document verification and a 2-minute hold. Proceed?"
      )
    ) {
      setIsWithdrawalMode(true);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  // ✅ Handle document verification and salary deduction
  const handleSubmitCriticalRequest = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);

    if (!amount || amount <= 0 || !emergencyReason.trim() || !file) {
      setMessage("⚠ Please fill all fields and upload a valid document.");
      return;
    }

    if (amount > totalSalary) {
      setMessage("❌ Withdrawal exceeds available salary.");
      return;
    }

    setIsVerifying(true);
    setMessage("⏳ Verifying your uploaded document...");

    // Simulate verification
    setTimeout(() => {
      setMessage("✅ Document verified successfully! Processing withdrawal...");

      setTimeout(() => {
        const newSalary = totalSalary - amount;

        // Update state & localStorage
        setTotalSalary(newSalary);
        localStorage.setItem("salaryData", JSON.stringify({ salary: newSalary }));

        if (typeof onWithdrawal === "function") {
          onWithdrawal(amount);
        }

        setIsVerifying(false);
        setMessage(`💸 ₹${amount.toLocaleString("en-IN")} withdrawn successfully.`);
        setWithdrawalAmount("");
        setEmergencyReason("");
        setFile(null);
        setIsWithdrawalMode(false);
      }, 2500);
    }, 2000);
  };

  // -----------------------
  // Withdrawal Mode Form
  // -----------------------
  if (isWithdrawalMode) {
    return (
      <div className="withdrawal-form-page page-section">
        <h2>⚠ Critical Funds Access Request</h2>
        <p>
          Enter amount, upload documents, and describe your{" "}
          <b>valid emergency</b> for review and fund release.
        </p>

        <form onSubmit={handleSubmitCriticalRequest}>
          <label>Amount to Withdraw (₹):</label>
          <input
            type="number"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(e.target.value)}
            required
            min="1"
          />

          <label>Emergency Reason:</label>
          <textarea
            placeholder="E.g., Hospital bill, Critical home repair..."
            value={emergencyReason}
            onChange={(e) => setEmergencyReason(e.target.value)}
            rows="3"
            required
          ></textarea>

          <label>Upload Supporting Documents:</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.png,.pdf"
            required
          />

          <div className="withdrawal-actions">
            <button
              type="button"
              onClick={() => setIsWithdrawalMode(false)}
              className="cancel-btn"
              disabled={isVerifying}
            >
              Cancel Request
            </button>

            <button
              type="submit"
              className="submit-btn primary-btn"
              disabled={isVerifying}
            >
              {isVerifying ? "Processing..." : "Submit for Review"}
            </button>
          </div>
        </form>

        {message && (
          <p style={{ marginTop: "10px", fontWeight: "600" }}>{message}</p>
        )}
      </div>
    );
  }

  // -----------------------
  // Main Savings Page
  // -----------------------
  return (
    <div className="saving-page page-section">
      <h1>Savings Section</h1>
      <p><strong>Email:</strong> {email || "Not Logged In"}</p>
      <h2>Total Salary: ₹{totalSalary.toLocaleString("en-IN")}</h2>

      {/* ➕ Add Extra Money Section */}
      <div className="add-money-box" style={{ margin: "20px 0", textAlign: "center" }}>
        <h3>Add Extra Money</h3>
        <input
          type="number"
          placeholder="Enter amount (₹)"
          id="extraAmount"
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #ffd700",
            marginRight: "10px",
            background: "black",
            color: "#ffd700",
          }}
        />
        <select
          id="fundSelect"
          style={{
            padding: "6px",
            borderRadius: "8px",
            border: "1px solid #ffd700",
            background: "black",
            color: "#ffd700",
            marginRight: "10px",
          }}
        >
          <option value="validation">Validation Fund</option>
          <option value="retirement">Retirement Fund</option>
        </select>
        <button
          className="primary-btn"
          style={{ background: "#ffd700", color: "black", borderRadius: "10px" }}
          onClick={() => {
            const amount = parseFloat(document.getElementById("extraAmount").value);
            const fundType = document.getElementById("fundSelect").value;

            if (!amount || amount <= 0) {
              alert("⚠️ Enter a valid positive amount!");
              return;
            }

            // Add amount to total salary
            const newTotal = totalSalary + amount;
            setTotalSalary(newTotal);
            localStorage.setItem("salaryData", JSON.stringify({ salary: newTotal }));

            alert(`✅ ₹${amount.toLocaleString("en-IN")} added to ${fundType} fund and total updated!`);

            document.getElementById("extraAmount").value = "";
          }}
        >
          Add Amount
        </button>
      </div>

      <div className="saving-sections">
        <p>Savings: 40%</p>
        <p>Emergency: 20%</p>
        <p>Groceries: 25%</p>
        <p>Enjoyment: 15%</p>
      </div>

      <div className="action-area" style={{ justifyContent: "flex-start" }}>
        <button
          className="primary-btn link-btn"
          onClick={handleCriticalWithdrawal}
          style={{ margin: "0" }}
        >
          Access Funds for Critical Need (Strict Policy)
        </button>
      </div>

      <div className="goals-grid">
        {goals.map((goal) => (
          <div key={goal.id} className="goal-card">
            <h4>{goal.name}</h4>
            <p>Target: ₹{goal.target.toLocaleString("en-IN")}</p>
            <progress value={goal.current} max={goal.target}></progress>
            <p className="progress-text">
              Saved: ₹{goal.current.toLocaleString("en-IN")} (
              {((goal.current / goal.target) * 100 || 0).toFixed(1)}% Complete)
            </p>
          </div>
        ))}
      </div>

      {message && (
        <p style={{ marginTop: "20px", fontWeight: "600", color: "#ffd700" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SavingPage;
