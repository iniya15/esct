import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authcontext/index';
import POTable from '../components/POTable';

const POTablePage = () => {
  const { user } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/user-pos?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setPurchaseOrders(data))
        .catch(err => console.error("Error loading PO data:", err));
    }
  }, [user]);

  return (
    <div>
      <h2 style={{ color: '#1a237e' }}>Your PO History</h2>
      <POTable purchaseOrders={purchaseOrders} />
    </div>
  );
};

export default POTablePage;
