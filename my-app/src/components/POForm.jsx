import React, { useState } from 'react';
import BackButton from './BackButton'; // ✅ Import back button

const POForm = ({ onAddItem, onRemoveItem, onSubmitPO, cartItems }) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    vendor: '',
    project: '',
    deliveryDate: today,
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMore = (e) => {
    e.preventDefault();
    const { item, quantity, vendor, project, deliveryDate, address } = formData;

    if (!item || !quantity || !vendor || !project || !deliveryDate || !address) {
      alert("Please fill in all fields before adding the item.");
      return;
    }

    if (parseInt(quantity) < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    onAddItem(formData);
    setFormData({
      item: '',
      quantity: '',
      vendor: '',
      project: '',
      deliveryDate: today,
      address: '',
    });
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Please add at least one item before submitting.");
      return;
    }
    onSubmitPO();
  };

  return (
    <form>
      <BackButton /> {/* ✅ Back button at the top */}
      <h3>Create Purchase Order</h3>

      <label>
        Item:
        <input
          type="text"
          name="item"
          value={formData.item}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Quantity:
        <input
          type="number"
          name="quantity"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          required
          onInvalid={(e) => e.target.setCustomValidity('Quantity must be at least 1')}
          onInput={(e) => e.target.setCustomValidity('')}
        />
      </label>
      <br />

      <label>
        Vendor:
        <input
          type="text"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Project:
        <input
          type="text"
          name="project"
          value={formData.project}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Expected Delivery Date:
        <input
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={handleChange}
          min={today}
          required
        />
      </label>
      <br />

      <label>
        Address:
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <button onClick={handleAddMore} style={{ marginTop: '10px' }}>
        Add More
      </button>

      {cartItems.length > 0 && (
        <div
          style={{
            marginTop: '1rem',
            background: '#f9f9f9',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <h4>Order Summary (Receipt)</h4>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} style={{ marginBottom: '6px' }}>
                <strong>{item.item}</strong> — {item.quantity} units from {item.vendor}, for <em>{item.project}</em><br />
                Delivery: {item.deliveryDate}, Address: {item.address}
                <button
                  onClick={() => onRemoveItem(index)}
                  style={{
                    marginLeft: '10px',
                    color: 'white',
                    backgroundColor: 'red',
                    border: 'none',
                    padding: '2px 6px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleFinalSubmit} style={{ marginTop: '10px' }}>
            Submit PO
          </button>
        </div>
      )}
    </form>
  );
};

export default POForm;
