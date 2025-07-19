import React, { useState } from 'react';
import POForm from '../components/POForm';
import { useAuth } from '../contexts/authcontext/index';

const MaterialManagement = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const handleAddItem = (item) => {
    setCartItems(prev => [...prev, item]);
  };

  const handleRemoveItem = (indexToRemove) => {
    setCartItems(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitPO = async () => {
    if (cartItems.length === 0) {
      alert("Please add at least one item before submitting.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/submit-po', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, email: user.email })
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "PO submitted successfully!");
        setCartItems([]); // Clear cart after success
      } else {
        alert("Failed to submit PO: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting PO:", error);
      alert("Something went wrong while submitting the PO.");
    }
  };

  if (!user || !user.email) {
    return <p>Loading user info...</p>;
  }

  return (
    <div>
      <h2 style={{ color: '#1a237e' }}>Material Management Dashboard</h2>

      <POForm
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onSubmitPO={handleSubmitPO}
        cartItems={cartItems}
      />
    </div>
  );
};

export default MaterialManagement;
