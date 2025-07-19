// src/components/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        marginBottom: '1rem',
        color: '#1a237e',
        fontWeight: 'bold'
      }}
    >
      <span style={{ fontSize: '20px', marginRight: '6px' }}>←</span> Back
    </button>
  );
};

export default BackButton;
