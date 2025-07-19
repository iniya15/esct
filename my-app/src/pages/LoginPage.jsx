// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../contexts/authcontext/index';
import { useNavigate } from 'react-router-dom';

//const isAdminEmail = (email) => /^admin\d+@example\.com$/.test(email);

const LoginPage = () => {
  const { login, signup, resetPassword, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('engineer');
  const [formType, setFormType] = useState('login');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (formType === 'login') {
        await login({ email, password });
        navigate('/dashboard');
      } else if (formType === 'signup') {
        if (!role) throw new Error("Please select a role");
        await signup({ email, password, role });
        navigate('/dashboard');
      } else if (formType === 'forgot') {
        await resetPassword(email);
        alert('Password reset email sent');
        setFormType('login');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>
          {formType === 'login'
            ? 'Login'
            : formType === 'signup'
            ? 'Sign Up'
            : 'Forgot Password'}
        </h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        {formType !== 'forgot' && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {formType === 'signup' && (
          <select
            value={role}
            required
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="engineer">Engineer</option>
            <option value="manager">Manager</option>
          </select>
        )}

        <button type="submit">
          {formType === 'login'
            ? 'Login'
            : formType === 'signup'
            ? 'Create Account'
            : 'Reset Password'}
        </button>

        {formType === 'login' && (
          <button type="button" onClick={loginWithGoogle}>
            Continue with Google
          </button>
        )}

        <div className="links">
          {formType !== 'login' && (
            <p onClick={() => setFormType('login')}>Back to Login</p>
          )}
          {formType === 'login' && (
            <>
              <p onClick={() => setFormType('signup')}>
                Don't have an account? Sign Up
              </p>
              <p onClick={() => setFormType('forgot')}>
                Forgot Password?
              </p>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
