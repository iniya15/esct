import React from 'react';
import BackButton from './BackButton'; // ✅ Import the BackButton

const POTableManagerView = ({ purchaseOrders, onAction }) => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <BackButton /> {/* ✅ Back button at the top */}
      <h3 style={{ color: '#1a237e' }}>Pending Purchase Orders</h3>

      {purchaseOrders.length === 0 ? (
        <p>No pending POs available.</p>
      ) : (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ccc',
          marginTop: '1rem'
        }}>
          <thead style={{ backgroundColor: '#e3f2fd' }}>
            <tr>
              <th style={thStyle}>Submitted By</th>
              <th style={thStyle}>Item Details</th>
              <th style={thStyle}>Actions</th>
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
                  {/* Submitter */}
                  <td style={tdStyle}>
                    <strong>{po.user_email || 'N/A'}</strong>
                  </td>

                  {/* Item Details */}
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
                              Project: {item.project || 'N/A'}<br />
                              Vendor: {item.vendor || 'N/A'}<br />
                              Delivery: {item.deliveryDate || 'N/A'} to {item.address || 'N/A'}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* Actions */}
                  <td style={tdStyle}>
                    {po.status === 'Pending' ? (
                      <>
                        <button onClick={() => onAction(po.id, 'Approved')} style={btnApprove}>Approve</button>
                        <button onClick={() => onAction(po.id, 'Rejected')} style={btnReject}>Reject</button>
                      </>
                    ) : (
                      <em>No action available</em>
                    )}
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

const btnApprove = {
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  marginRight: '8px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const btnReject = {
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default POTableManagerView;
