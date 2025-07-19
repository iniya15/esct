// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isManager = user?.email?.startsWith('admin');

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Engineering Supply Chain Portal</h1>
      <p style={styles.subheading}>
        Streamline your procurement process, manage purchase orders efficiently, and
        maintain inventory oversight in real-time.Designed to streamline collaboration between engineering teams and management, this tool transforms the traditional purchase order process into a modern, digital workflow.
        
        Engineers can draft and submit detailed Purchase Orders (POs) effortlessly, while managers can review, approve, and track these requests in real time — all from a single, unified interface.
      </p>
      <p style={styles.subheading}>
        Whether you're overseeing large-scale infrastructure projects or day-to-day procurement,this platform ensures that every material request is traceable, efficient, and securely logged.
        
        From vendor coordination to delivery schedules, and from inventory records to budget approvals, the Engineering Supply Chain Tool empowers your team with clarity, control, and confidence.
        
        Embrace speed, accountability, and transparency — and let your supply chain work smarter, not harder.
      </p>

      <div style={styles.buttonGroup}>
        {isManager ? (
          <>
            <button style={styles.button} onClick={() => navigate('/manager')}>PO Approvals</button>
            <button style={styles.button} onClick={() => navigate('/inventory')}>Inventory</button>
          </>
        ) : (
          <>
            <button style={styles.button} onClick={() => navigate('/po-form')}>PO Form</button>
            <button style={styles.button} onClick={() => navigate('/po-table')}>PO Table</button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center'
  },
  heading: {
    fontSize: '2rem',
    color: '#1a237e'
  },
  subheading: {
    fontSize: '1.1rem',
    margin: '1rem 0 2rem',
    color: '#555'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1a73e8',
    color: 'white',
    cursor: 'pointer',
  }
};

export default Dashboard;
