  import React, { createContext, useContext, useEffect, useState } from 'react';
  import {
    onAuthStateChanged,
    User,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from 'firebase/auth';
  import { auth, db } from '../services/firebase';
  import { doc, getDoc, setDoc } from 'firebase/firestore';

  type AuthState = {
    user: User | null;
    role?: 'editor' | 'viewer' | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: string) => Promise<void>;
    logout: () => Promise<void>;
  };

  const AuthContext = createContext<AuthState | undefined>(undefined);

  export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<"editor" | "viewer">("viewer");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, async (u) => {
        if (!u) {
          setUser(null);
          setRole('viewer');
          setLoading(false);
          return;
        }

        try {
          const ref = doc(db, 'users', u.uid);
          const snap = await getDoc(ref);
          setRole(snap.exists() ? (snap.data() as any).role : null);
        } catch (err) {
          console.error('Error fetching role:', err);
          //setRole(null);
        }

        setUser(u);
        setLoading(false);
      });

      return () => unsub();
    }, []);

    // 🔹 Login
    const login = async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
      // Wait for the AuthState to update
    await new Promise<void>((resolve) => {
      const unsub = onAuthStateChanged(auth, (u) => {
        if (u) {
          const ref = doc(db, 'users', u.uid);
          getDoc(ref).then((snap) => {
            setRole(snap.exists() ? (snap.data() as any).role : null);
            setUser(u);
            resolve();
          });
        } else {
          resolve();
        }
        unsub();
      });
    });
    };

    // 🔹 Register
    const register = async (email: string, password: string, role: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email,
        role,
        createdAt: new Date(),
      });
    };

    // 🔹 Logout
    const logout = async () => {
      await signOut(auth);
    };

    return (
      <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

  export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
  }
