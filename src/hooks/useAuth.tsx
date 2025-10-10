import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

type AuthState = { user: User | null; role?: 'editor'|'viewer'|null; loading: boolean };
const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({ user: null, role: null, loading: true });
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { setState({ user: null, role: null, loading: false }); return; }
      // fetch role from users collection
      const ref = doc(db, 'users', u.uid);
      const snap = await getDoc(ref);
      // need ot fix the any type here
      const role = snap.exists() ? (snap.data() as any).role : null;
      setState({ user: u, role, loading: false });
    });
    return () => unsub();
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
