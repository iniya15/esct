import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  loginWithEmail,
  signupWithEmail,
  logoutUser,
  resetPassword as firebaseResetPassword,
  loginWithGoogle as firebaseLoginWithGoogle
} from '../../firebase/auth';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

const AuthContext = createContext();

// ✅ Admin email pattern: admin<number>@example.com
const isAdminEmail = (email) => /^admin\d+@example\.com$/.test(email);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error("❌ auth is undefined. Check firebase.js export.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("✅ Firebase user:", firebaseUser);
      setUser(firebaseUser);
      setIsAdmin(firebaseUser && isAdminEmail(firebaseUser.email)); // ✅ Updated
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const firebaseUser = await loginWithEmail(email, password);
      setUser(firebaseUser);
      setIsAdmin(isAdminEmail(firebaseUser.email)); // ✅ Updated
      return firebaseUser;
    } catch (error) {
      throw error;
    }
  };

  const signup = async ({ email, password, role }) => {
    try {
      const firebaseUser = await signupWithEmail(email, password, role);
      setUser(firebaseUser);
      setIsAdmin(isAdminEmail(firebaseUser.email)); // ✅ Updated
      return firebaseUser;
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const firebaseUser = await firebaseLoginWithGoogle();
      setUser(firebaseUser);
      setIsAdmin(isAdminEmail(firebaseUser.email)); // ✅ Updated
      return firebaseUser;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await firebaseResetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        login,
        signup,
        resetPassword,
        logout,
        loginWithGoogle
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
