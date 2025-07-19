// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MaterialManagement from './pages/MaterialManagement';
import POTablePage from './pages/POTablePage';
import ManagerPage from './pages/ManagerDashboard';
import InventoryPage from './pages/InventoryPage';

import { AuthProvider, useAuth } from './contexts/authcontext/index';

// ✅ Route protection
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const ManagerRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return isAdmin ? children : <p>Access denied. Manager only.</p>;
};

// ✅ Global logout header
const Header = () => {
  const { user, logout } = useAuth();

  return user ? (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 20,
    }}>
      <span style={{ marginRight: '1rem' }}>{user.email}</span>
      <button onClick={logout}>Logout</button>
    </div>
  ) : null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <h1><center>⚙️Engineering Supply Chain Tool🛠️</center></h1>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/po-form" element={
              <ProtectedRoute>
                <MaterialManagement />
              </ProtectedRoute>
            } />
            <Route path="/po-table" element={
              <ProtectedRoute>
                <POTablePage />
              </ProtectedRoute>
            } />
            <Route path="/manager" element={
              <ManagerRoute>
                <ManagerPage />
              </ManagerRoute>
            } />
            <Route path="/inventory" element={
              <ManagerRoute>
                <InventoryPage />
              </ManagerRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
