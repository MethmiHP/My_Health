import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import stethoscopeBg from '../../assets/steth.jpg';

export default function CashierPayments() {
  const { user } = useAuth();
  const [nic, setNic] = useState('');
  const [bill, setBill] = useState(null);
  const [method, setMethod] = useState('cash');
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');

  const getBill = async () => {
    const res = await axios.get(`/api/payments/calculate/${nic}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setBill(res.data);
    setAmount(res.data.total);
  };

  const makePayment = async () => {
    await axios.post(
      '/api/payments/make',
      {
        visitId: 'visit-001',
        patientId: bill.patientId,
        method,
        amount,
        note,
      },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    alert('Payment successful!');
  };

  return (
    <div className="min-h-screen">
      {/* Background Image - positioned to not cover navbar */}
      <div 
        className="fixed top-16 left-0 right-0 bottom-0 bg-cover bg-center bg-no-repeat opacity-75"
        style={{ backgroundImage: `url(${stethoscopeBg})` }}
        aria-hidden="true"
      />
      {/* Main content */}
      <div className="relative z-10 p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Payments</h1>

      <input
        value={nic}
        onChange={(e) => setNic(e.target.value)}
        placeholder="Enter Patient NIC"
        className="border p-2 rounded w-64 mr-2"
      />
      <button onClick={getBill} className="bg-blue-500 text-white px-4 py-2 rounded">
        Fetch Bill
      </button>

      {bill && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Medications</h2>
          <ul>
            {bill.medications.map((m, i) => (
              <li key={i}>
                {m.name} — Rs. {m.name in bill ? bill[m.name] : ''}
              </li>
            ))}
          </ul>

          <p className="mt-4 font-bold">Total: Rs. {bill.total}</p>

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="border p-2 rounded mt-4"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mobile">Mobile</option>
          </select>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note"
            className="border w-full p-2 rounded mt-2"
          />

          <button
            onClick={makePayment}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Pay
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
