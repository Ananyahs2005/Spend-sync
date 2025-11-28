import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./image.jpg";

const styles = {
container: {
minHeight: "100vh",
display: "flex",
background: "linear-gradient(90deg, #000 60%, #FFD700 100%)",
fontFamily: "Montserrat, Arial, sans-serif",
},
logoSection: {
flex: "0 0 40%",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "#000",
},
logoImg: {
maxWidth: "80%",
borderRadius: "20px",
boxShadow: "0 0 40px #FFD700",
},
contentSection: {
flex: 1,
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
padding: "40px",
textAlign: "center",
},
title: {
color: "#FFD700",
fontSize: "2.5rem",
fontWeight: "bold",
marginBottom: "10px",
},
tagline: {
color: "#bfa500",
fontSize: "1.2rem",
marginBottom: "40px",
},
btn: {
fontSize: "1.1rem",
color: "#fff",
background: "#FFD700",
border: "none",
borderRadius: "8px",
padding: "13px 38px",
fontWeight: "bold",
cursor: "pointer",
margin: "10px",
transition: "0.3s",
},
btnSecondary: {
background: "#000",
color: "#FFD700",
border: "2px solid #FFD700",
},
buttonsRow: {
display: "flex",
flexWrap: "wrap",
gap: "16px",
justifyContent: "center",
marginTop: "20px",
},
formContainer: {
marginTop: "40px",
background: "rgba(255, 255, 255, 0.1)",
borderRadius: "15px",
padding: "30px",
width: "100%",
maxWidth: "500px",
color: "#fff",
boxShadow: "0 0 15px rgba(255, 215, 0, 0.3)",
},
inputGroup: {
marginBottom: "15px",
textAlign: "left",
},
label: {
color: "#FFD700",
fontWeight: "bold",
display: "block",
marginBottom: "5px",
},
input: {
width: "100%",
padding: "10px",
borderRadius: "6px",
border: "none",
fontSize: "1rem",
outline: "none",
},
submitBtn: {
marginTop: "10px",
background: "#FFD700",
color: "#000",
border: "none",
padding: "12px 30px",
borderRadius: "8px",
fontWeight: "bold",
cursor: "pointer",
width: "100%",
},
};

const Dashboard = () => {
const navigate = useNavigate();

const [salaryAmount, setSalaryAmount] = useState("");
const [savingsPercent, setSavingsPercent] = useState(20);
const [emergencyPercent, setEmergencyPercent] = useState(20);
const [groceryPercent, setGroceryPercent] = useState(30);
const [enjoymentPercent, setEnjoymentPercent] = useState(30);
const [totalBalance, setTotalBalance] = useState(0);

useEffect(() => {
fetch("[http://localhost:5000/api/allocations](http://localhost:5000/api/allocations)")
.then((res) => res.json())
.then((data) => {
if (data.success && data.allocation) {
const alloc = data.allocation;
setSalaryAmount(alloc.salary);
setTotalBalance(alloc.salary);
setSavingsPercent(alloc.savingsPercent);
setEmergencyPercent(alloc.emergencyPercent);
setGroceryPercent(alloc.groceryPercent);
setEnjoymentPercent(alloc.enjoymentPercent);
}
})
.catch((err) => console.error("❌ Fetch error:", err));
}, []);

const handleSubmit = async (e) => {
e.preventDefault();
const salary = parseFloat(salaryAmount);
const totalPercent =
parseFloat(savingsPercent) +
parseFloat(emergencyPercent) +
parseFloat(groceryPercent) +
parseFloat(enjoymentPercent);


if (salary <= 0 || isNaN(salary) || totalPercent > 100) {
  alert(
    `⚠ Allocation Failed! Total percentage (${totalPercent}%) cannot exceed 100% or salary must be valid.`
  );
  return;
}

try {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch("http://localhost:5000/api/allocate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user?.email,
      salary,
      savingsPercent: parseFloat(savingsPercent),
      emergencyPercent: parseFloat(emergencyPercent),
      groceryPercent: parseFloat(groceryPercent),
      enjoymentPercent: parseFloat(enjoymentPercent),
    }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("✅ Salary Allocated Successfully!");
    setTotalBalance(salary);

    if (user?.email) {
      await axios.post("http://localhost:5000/dashboard/salary", {
        email: user.email,
        salary,
      });
    }
  } else {
    alert(`❌ ${data.message}`);
  }
} catch (err) {
  console.error("❌ Error submitting allocation:", err);
  alert("Error connecting to the server.");
}


};

return ( <div style={styles.container}> <div style={styles.logoSection}> <img src={logo} alt="SpendSync Logo" style={styles.logoImg} /> </div>


  <div style={styles.contentSection}>
    <h1 style={styles.title}>Welcome to SpendSync Dashboard</h1>
    <p style={styles.tagline}>
      Track, save, and manage all aspects of your money!
    </p>

    <div style={styles.buttonsRow}>
      <button onClick={() => navigate("/savings")} style={styles.btn}>
        💰 Savings
      </button>
      <button onClick={() => navigate("/enjoyment")} style={styles.btn}>
        🎬 Entertainment
      </button>
      <button onClick={() => navigate("/emergency")} style={styles.btn}>
        🚨 Emergency
      </button>
      <button onClick={() => navigate("/grocery")} style={styles.btn}>
        🏠 Daily Activities
      </button>
      <button onClick={() => navigate("/bank")} style={styles.btn}>
        Connect to bank
      </button>
      <button
        onClick={() => navigate("/")}
        style={{ ...styles.btn, ...styles.btnSecondary }}
      >
        Logout
      </button>
    </div>

    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <h3>💼 Add & Allocate Salary</h3>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Salary Amount (₹)</label>
        <input
          type="number"
          value={salaryAmount}
          onChange={(e) => setSalaryAmount(e.target.value)}
          placeholder="Enter your salary"
          style={styles.input}
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Savings (%)</label>
        <input
          type="number"
          value={savingsPercent}
          onChange={(e) => setSavingsPercent(e.target.value)}
          min="0"
          max="100"
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Emergency Fund (%)</label>
        <input
          type="number"
          value={emergencyPercent}
          onChange={(e) => setEmergencyPercent(e.target.value)}
          min="0"
          max="100"
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Bills / Payments (%)</label>
        <input
          type="number"
          value={groceryPercent}
          onChange={(e) => setGroceryPercent(e.target.value)}
          min="0"
          max="100"
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Enjoyment (%)</label>
        <input
          type="number"
          value={enjoymentPercent}
          onChange={(e) => setEnjoymentPercent(e.target.value)}
          min="0"
          max="100"
          style={styles.input}
        />
      </div>

      <p>
        Total Allocation:{" "}
        {parseFloat(savingsPercent) +
          parseFloat(emergencyPercent) +
          parseFloat(groceryPercent) +
          parseFloat(enjoymentPercent)}
        %
      </p>

      <button type="submit" style={styles.submitBtn}>
        Process Allocation
      </button>
    </form>
  </div>
</div>


);
};

export default Dashboard;