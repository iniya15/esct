import React from 'react';
import BackButton from './BackButton';

const POTable = ({ purchaseOrders }) => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <BackButton />
      <h3 style={{ color: '#1a237e' }}>Your Submitted Purchase Orders</h3>

      {purchaseOrders.length === 0 ? (
        <p>No purchase orders submitted yet.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ccc',
            marginTop: '1rem',
          }}
        >
          <thead style={{ backgroundColor: '#e3f2fd' }}>
            <tr>
              <th style={thStyle}>Summary</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po) => {
              const items = po.items || [];
              const totalItems = items.length;
              const totalQuantity = items.reduce(
                (sum, item) => sum + (parseInt(item.quantity) || 0),
                0
              );

              return (
                <tr key={po.id}>
                  <td style={tdStyle}>
                    <strong>{totalItems}</strong> item{totalItems !== 1 ? 's' : ''} — Total Qty: <strong>{totalQuantity}</strong>
                    <br />
                    <strong>Items:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                      {items.map((item, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                          <div>
                            <strong>{item.item || 'Unnamed Item'}</strong> (Qty: {item.quantity})
                            <br />
                            <span style={{ fontStyle: 'italic' }}>
                              Project: {item.project || 'N/A'} <br />
                              Vendor: {item.vendor || 'N/A'} <br />
                              Delivery: {item.deliveryDate || 'N/A'} to {item.address || 'N/A'}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: statusColor(po.status) }}>
                    {po.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Styles
const thStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'left',
  backgroundColor: '#f0f8ff',
};

const tdStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  verticalAlign: 'top',
};

const statusColor = (status) => {
  if (status === 'Approved') return 'green';
  if (status === 'Rejected') return 'red';
  return 'orange'; // Pending
};

export default POTable;
