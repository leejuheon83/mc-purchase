'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { emailToEmployeeNo, ADMIN_LOGIN_ID } from '../services/auth';
import { employees } from '../data/employees';
import { DEPARTMENTS } from '../constants';
import type { AuthUser, AuthContextValue } from '../types/auth';

const employeesById = new Map(employees.map((e) => [e.employeeId, e]));

async function buildAuthUser(firebaseUser: FirebaseUser): Promise<AuthUser> {
  const email = firebaseUser.email ?? '';
  const employeeId = emailToEmployeeNo(email) || firebaseUser.uid;
  const employee = employeesById.get(employeeId);
  const isAdmin = employeeId === ADMIN_LOGIN_ID;
  const name = isAdmin ? '관리자' : (employee?.name ?? employeeId);

  // Firestore-ready: fetch from users/{uid} when available
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: firebaseUser.uid,
        employeeId: data.employeeId ?? employeeId,
        email,
        name: data.name ?? name,
        department: data.department ?? DEPARTMENTS[0],
        isAdmin: data.isAdmin ?? isAdmin
      };
    }
  } catch {
    // Firestore not configured yet, use fallback
  }

  return {
    uid: firebaseUser.uid,
    employeeId,
    email,
    name,
    department: isAdmin ? '관리자' : DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
    isAdmin
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const authUser = await buildAuthUser(fbUser);
          setUser(authUser);
        } catch (err) {
          console.error('Failed to build auth user', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    firebaseUser,
    loading,
    error,
    setError: useCallback((e: string | null) => setError(e), [])
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
