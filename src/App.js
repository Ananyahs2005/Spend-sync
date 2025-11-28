import React, { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Pages
import SpendSyncLanding from "./SpendSyncLanding";
import Dashboard from "./Dashboard";
import SavingPage from "./Components/pages/SavingPage";
import GroceryPage from "./Components/pages/GroceryPage";
import EnjoymentPage from "./Components/pages/EnjoymentPage";
import EmergencyPage from "./Components/pages/EmergencyPage";


// ✅ Chatbot
import Chatbot from "./Components/pages/ui/Chatbot";

import "./App.css";

// -----------------------------
// INITIAL DATA
// -----------------------------
const initialGoals = [
  { id: 1, name: "Retirement Fund", target: 500000, current: 0, allocation: 71 },
  { id: 2, name: "Vacation Fund", target: 80000, current: 0, allocation: 29 },
];

const initialCategories = {
  EmergencyFund: { targetMonths: 6, monthlyExpenses: 50000, currentBalance: 20000, limitPercent: 10 },
  GroceryShopping: { limit: 0, spent: 0, limitPercent: 25 },
  Enjoyment: { limit: 0, spent: 0, limitPercent: 15 },
  SavingsGoalPercent: 20,
};

// -----------------------------
// MAIN APP COMPONENT
// -----------------------------
function App() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [savingsGoals, setSavingsGoals] = useState(initialGoals);
  const [categories, setCategories] = useState(initialCategories);

  // --- SALARY ALLOCATION LOGIC ---
  const handleAllocateSalary = (data) => {
    const { salary, savingsPercent, emergencyPercent, groceryPercent, enjoymentPercent } = data;

    const calc = (p) => salary * (p / 100);
    const savingsAmt = calc(savingsPercent);
    const emergencyAmt = calc(emergencyPercent);
    const groceryAmt = calc(groceryPercent);
    const enjoymentAmt = calc(enjoymentPercent);
    const remaining = salary - (savingsAmt + emergencyAmt + groceryAmt + enjoymentAmt);

    setTotalBalance((prev) => prev + remaining);

    setCategories((prev) => ({
      ...prev,
      EmergencyFund: { ...prev.EmergencyFund, currentBalance: prev.EmergencyFund.currentBalance + emergencyAmt },
      GroceryShopping: { ...prev.GroceryShopping, limit: groceryAmt },
      Enjoyment: { ...prev.Enjoyment, limit: enjoymentAmt },
      SavingsGoalPercent: savingsPercent,
    }));

    setSavingsGoals((prev) =>
      prev.map((goal) => ({
        ...goal,
        current: goal.current + savingsAmt * (goal.allocation / 100),
      }))
    );
  };

  // --- 🆘 HANDLE EMERGENCY WITHDRAWAL ---
  const handleEmergencyWithdrawal = (amount) => {
    if (amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    setCategories((prev) => {
      const currentBalance = prev.EmergencyFund.currentBalance;
      if (amount > currentBalance) {
        alert("❌ Insufficient emergency balance!");
        return prev;
      }

      const updatedBalance = currentBalance - amount;
      alert(`✅ Document verified! ₹${amount} deducted from Emergency Fund.\nRemaining: ₹${updatedBalance}`);

      return {
        ...prev,
        EmergencyFund: {
          ...prev.EmergencyFund,
          currentBalance: updatedBalance,
        },
      };
    });
  };

  // --- 💸 HANDLE EMERGENCY DEPOSIT ---
  const handleEmergencyDeposit = (amount) => {
    if (amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    setCategories((prev) => {
      const updatedBalance = prev.EmergencyFund.currentBalance + Number(amount);
      alert(`✅ ₹${amount} successfully added to Emergency Fund.\nNew Balance: ₹${updatedBalance}`);
      return {
        ...prev,
        EmergencyFund: {
          ...prev.EmergencyFund,
          currentBalance: updatedBalance,
        },
      };
    });
  };

  // --- 💰 HANDLE SAVINGS WITHDRAWAL ---
  const handleSavingsWithdrawal = (amount, updatedGoals) => {
    setSavingsGoals(updatedGoals);
    setTotalBalance((prev) => prev - amount);
  };

  // --- 🛒 HANDLE GROCERY SPENDING (NEWLY ADDED) ---
  const handleGrocerySpend = (amount) => {
    setCategories((prev) => {
      const spent = prev.GroceryShopping.spent + amount;

      if (spent > prev.GroceryShopping.limit) {
        alert("❌ You’ve exceeded your grocery budget!");
        return prev;
      }

      alert(`✅ ₹${amount.toLocaleString("en-IN")} spent successfully!`);
      return {
        ...prev,
        GroceryShopping: {
          ...prev.GroceryShopping,
          spent,
        },
      };
    });
  };

  // --- 🛒 HANDLE GROCERY WITHDRAWAL (UNUSED LIMIT BACK TO BALANCE) ---
  const handleGroceryWithdrawal = (amount) => {
    setCategories((prev) => ({
      ...prev,
      GroceryShopping: {
        ...prev.GroceryShopping,
        spent: prev.GroceryShopping.spent,
        limit: prev.GroceryShopping.limit - amount,
      },
    }));

    setTotalBalance((prev) => prev + amount);
    alert(`✅ ₹${amount.toLocaleString("en-IN")} moved back to Total Balance!`);
  };

  return (
    <Router>
      <Routes>
        {/* 🏠 Landing Page */}
        <Route path="/" element={<SpendSyncLanding />} />

        {/* 📊 Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Dashboard
              totalBalance={totalBalance}
              savingsGoals={savingsGoals}
              categories={categories}
              onAllocateSalary={handleAllocateSalary}
            />
          }
        />

        {/* 💰 Savings Page */}
        <Route
          path="/savings"
          element={<SavingPage goals={savingsGoals} onWithdrawal={handleSavingsWithdrawal} />}
        />

        {/* 🚨 Emergency Page */}
        <Route
          path="/emergency"
          element={
            <EmergencyPage
              data={categories.EmergencyFund}
              onDeposit={handleEmergencyDeposit}
              onWithdrawal={handleEmergencyWithdrawal}
            />
          }
        />

        {/* 🛒 Grocery Page (✅ Fixed with onSpend & onWithdrawal) */}
        <Route
          path="/grocery"
          element={
            <GroceryPage
              data={categories.GroceryShopping}
              onSpend={handleGrocerySpend}
              onWithdrawal={handleGroceryWithdrawal}
            />
          }
        />

        {/* 🎉 Enjoyment Page */}
        <Route path="/enjoyment" element={<EnjoymentPage data={categories.Enjoyment} />} />
      </Routes>

      {/* 💬 Chatbot visible on all pages */}
      <Chatbot />
    </Router>
  );
}

export default App;
