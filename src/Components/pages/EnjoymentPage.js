import React, { useState } from "react";

const EnjoymentPage = () => {
  const [limit, setLimit] = useState(5000); // you can change the default limit here
  const [spent, setSpent] = useState(0);
  const [amount, setAmount] = useState("");

  const remaining = limit - spent;

  const handleSpend = (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (amt <= 0 || isNaN(amt)) {
      alert("⚠️ Please enter a valid amount!");
      return;
    }
    if (amt > remaining) {
      alert("❌ You’ve exceeded your enjoyment budget limit!");
      return;
    }

    const newSpent = spent + amt;
    setSpent(newSpent);
    alert(`✅ ₹${amt} added to enjoyment expenses. Total spent: ₹${newSpent}`);
    setAmount("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 40%, #FFD700 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFD700",
        fontFamily: "Montserrat, Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1>🎬 Enjoyment Tracker</h1>
      <p>Track your leisure expenses and enjoy guilt-free fun!</p>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "25px",
          borderRadius: "15px",
          marginTop: "20px",
          width: "320px",
          boxShadow: "0px 0px 10px rgba(255, 215, 0, 0.4)",
        }}
      >
        <h2>💰 Enjoyment Budget</h2>
        <p>Limit: ₹{limit.toLocaleString("en-IN")}</p>
        <p>Spent: ₹{spent.toLocaleString("en-IN")}</p>
        <p>Remaining: ₹{remaining.toLocaleString("en-IN")}</p>

        <progress
          value={spent}
          max={limit}
          style={{
            width: "100%",
            height: "10px",
            borderRadius: "10px",
            margin: "10px 0",
          }}
        ></progress>
        <p style={{ fontSize: "0.9em" }}>
          {((spent / limit) * 100 || 0).toFixed(1)}% used
        </p>

        <form onSubmit={handleSpend}>
          <input
            type="number"
            placeholder="Enter amount you pay"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              width: "80%",
              marginTop: "10px",
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              marginTop: "10px",
              padding: "8px 15px",
              backgroundColor: "#FFD700",
              color: "#000",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnjoymentPage;
