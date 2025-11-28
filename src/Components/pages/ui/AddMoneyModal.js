import React, { useState } from 'react';

 

const AddMoneyModal = ({ isOpen, onClose, goals, onSave }) => {

  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id.toString() || '');

  const [amount, setAmount] = useState('');

  const [frequency, setFrequency] = useState('one-time');

 

  if (!isOpen) return null;

 

  const handleSubmit = (e) => {

    e.preventDefault();

    const depositAmount = parseFloat(amount);

   

    if (depositAmount > 0 && selectedGoalId) {

      onSave(parseInt(selectedGoalId), depositAmount);

      onClose();

     

      setAmount('');

      setFrequency('one-time');

    } else {

      alert("Please ensure you've entered a valid amount and selected a goal.");

    }

  };

 

  return (

    <div className="modal-backdrop">

      <div className="modal-content">

        <h3>Add Money to Savings Goal</h3>

        <form onSubmit={handleSubmit}>

         

          <label htmlFor="goal-select">Goal to Fund:</label>

          <select

            id="goal-select"

            value={selectedGoalId}

            onChange={(e) => setSelectedGoalId(e.target.value)}

            required

          >

            {goals.map(goal => (

              <option key={goal.id} value={goal.id}>{goal.name}</option>

            ))}

          </select>

         

          <label htmlFor="deposit-amount">Deposit Amount (₹):</label>

          <input

            id="deposit-amount"

            type="number"

            value={amount}

            onChange={(e) => setAmount(e.target.value)}

            required

            min="1"

          />

         

          <label htmlFor="frequency-select">Frequency:</label>

          <select

            id="frequency-select"

            value={frequency}

            onChange={(e) => setFrequency(e.target.value)}

          >

            <option value="one-time">One-Time Deposit</option>

            <option value="monthly">Monthly Recurring</option>

          </select>

 

          <div className="modal-actions">

            <button type="submit" className="primary-btn">Confirm Deposit</button>

            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>

          </div>

        </form>

      </div>

    </div>

  );

};

 

export default AddMoneyModal;