import React, { useState } from 'react';

 
import "./EmergencyPage.css";


const EmergencyPage = ({ data, onDeposit, onWithdrawal }) => {

    const [depositAmount, setDepositAmount] = useState('');

    const [withdrawAmount, setWithdrawAmount] = useState('');

 

    // Assuming the allocated amount for this month is based on the limitPercent from the last salary run

    const targetAmount = data.targetMonths * data.monthlyExpenses;

    const currentBalance = data.currentBalance;

   

    // NOTE: This allocated amount isn't stored in 'data', so we'll show the current balance and target.

    // If you wish to show the *monthly allocated amount*, App.jsx would need to store it.

 

    const handleDepositSubmit = (e) => { e.preventDefault(); onDeposit(depositAmount); setDepositAmount(''); };

    const handleWithdrawalSubmit = (e) => { e.preventDefault(); onWithdrawal(withdrawAmount); setWithdrawAmount(''); };

 

    return (

        <div className="emergency-page page-section">

            <h2>Emergency Fund ({data.limitPercent}%)</h2>

            <p>This fund is your safety net, generally restricted access.</p>

           

            <div className="stats-box" style={{marginBottom: '20px'}}>

                <h3>Target Goal: ₹{targetAmount.toLocaleString('en-IN')} (6 Months)</h3>

                <h3>Current Balance: <span style={{color: '#4b0082'}}>₹{currentBalance.toLocaleString('en-IN')}</span></h3>

            </div>

 

            <progress value={currentBalance} max={targetAmount} style={{height: '15px', width: '100%'}}></progress>

            <p style={{fontSize: '0.9em', marginTop: '5px'}}>{((currentBalance / targetAmount) * 100 || 0).toFixed(1)}% Complete</p>

 

            <hr style={{margin: '30px 0'}} />

 

            <div style={{display: 'flex', gap: '40px'}}>

                <div style={{flex: 1}}>

                    <h4>+ Deposit Money</h4>

                    <form onSubmit={handleDepositSubmit}>

                        <input type="number" placeholder="Deposit Amount (₹)" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} required min="1" style={{width: '100%', padding: '8px', marginBottom: '10px'}}/>

                        <button type="submit" className="primary-btn">Confirm Deposit</button>

                    </form>

                </div>

 

                <div style={{flex: 1}}>

                    <h4>- Withdraw Funds (Quick Access)</h4>

                    <form onSubmit={handleWithdrawalSubmit}>

                        <input type="number" placeholder="Withdraw Amount (₹)" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} required min="1" style={{width: '100%', padding: '8px', marginBottom: '10px'}}/>

                        <button type="submit" className="cancel-btn" style={{backgroundColor: '#b30000', color: 'white'}}>Withdraw Funds</button>

                    </form>

                </div>

            </div>

        </div>

    );

};

 

export default EmergencyPage;

