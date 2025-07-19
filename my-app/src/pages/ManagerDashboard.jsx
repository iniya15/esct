import React, { useEffect, useState } from 'react';
import POTableManagerView from '../components/POTableManagerView';

const ManagerDashboard = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/pending-pos') // replace with your backend route
      .then(res => res.json())
      .then(data => setPurchaseOrders(data))
      .catch(err => console.error("Error fetching POs:", err));
  }, []);

  const handleAction = async (id, action) => {
    try {
      const response = await fetch('http://localhost:5000/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action })
      });

      if (response.ok) {
        setPurchaseOrders(prev => prev.map(po =>
          po.id === id ? { ...po, status: action } : po
        ));
      } else {
        alert("Failed to update PO status.");
      }
    } catch (error) {
      console.error("Error updating PO:", error);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1a237e' }}>Manager Dashboard</h2>
      <POTableManagerView purchaseOrders={purchaseOrders} onAction={handleAction} />
    </div>
  );
};

export default ManagerDashboard;
