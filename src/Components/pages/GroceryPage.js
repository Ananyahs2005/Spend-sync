import React, { useState } from 'react';
import "./GroceryPage.css";

const GroceryPage = () => {
  // Initial Grocery Budget
  const [limit, setLimit] = useState(5000); // total monthly limit
  const [spent, setSpent] = useState(0);    // amount spent
  const [billAmount, setBillAmount] = useState("");
  const [billType, setBillType] = useState("Rent Bill");
  const [billNumber, setBillNumber] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const remaining = limit - spent;

  // ✅ Add amount to grocery spent
  const handleBillPaymentSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(billAmount);

    if (amount <= 0 || isNaN(amount) || amount > remaining) {
      alert(`Invalid amount. Must be between ₹1 and ₹${remaining}.`);
      return;
    }

    if (!billNumber.trim()) {
      alert("Please enter Bill/Account number.");
      return;
    }

    setSpent(prev => prev + amount);

    alert(`✅ ₹${amount} paid for ${billType} (Account: ${billNumber}).`);

    setBillAmount("");
    setBillNumber("");
  };

  // ✅ Withdraw unused funds
  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);

    if (amount <= 0 || isNaN(amount) || amount > remaining) {
      alert(`Invalid withdrawal amount. Must be between ₹1 and ₹${remaining}.`);
      return;
    }

    setSpent(prev => prev - amount);
    alert(`💰 ₹${amount} withdrawn back to total balance.`);
    setWithdrawAmount("");
  };

  return (
    <div className="grocery-page page-section">
      <h2>🛒 Grocery / Monthly Payments</h2>

      <div className="stats-box" style={{ marginBottom: '20px' }}>
        <h3>Allocated Limit: <span style={{ color: 'darkgreen' }}>₹{limit.toLocaleString('en-IN')}</span></h3>
        <h3>Spent: ₹{spent.toLocaleString('en-IN')}</h3>
        <h3>Remaining: <span style={{ color: remaining >= 0 ? 'inherit' : 'red' }}>₹{remaining.toLocaleString('en-IN')}</span></h3>
      </div>

      <progress value={spent} max={limit} style={{ height: '15px', width: '100%' }}></progress>
      <p style={{ fontSize: '0.9em', marginTop: '5px' }}>{((spent / limit) * 100 || 0).toFixed(1)}% Used</p>

      <hr style={{ margin: '30px 0' }} />

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* BILL PAYMENT SECTION */}
        <div style={{ flex: 1 }}>
          <h4>💸 Make a Payment</h4>
          <form onSubmit={handleBillPaymentSubmit}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bill Type:</label>
            <select
              value={billType}
              onChange={(e) => setBillType(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            >
              <option value="Rent Bill">Rent Bill</option>
              <option value="EMI">EMI (Loan Repayment)</option>
              <option value="Electricity Bill">Electricity Bill</option>
              <option value="Water Bill">Water Bill</option>
            </select>

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bill/Account Number:</label>
            <input
              type="text"
              placeholder="e.g., 1234567890"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Amount (₹):</label>
            <input
              type="number"
              placeholder="Enter Payment Amount"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              required
              min="1"
              max={remaining}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />

            <button type="submit" className="primary-btn">Pay {billType}</button>
          </form>
        </div>

        {/* WITHDRAW SECTION */}
        <div style={{ flex: 1 }}>
          <h4>↩️ Withdraw Unused Limit</h4>
          <form onSubmit={handleWithdrawalSubmit}>
            <p style={{ fontSize: '0.8em', marginBottom: '8px' }}>
              Move unused funds back to your available balance.
            </p>

            <input
              type="number"
              placeholder="Withdraw Amount (₹)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              required
              min="1"
              max={remaining}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />

            <button type="submit" className="cancel-btn">Withdraw</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroceryPage;
