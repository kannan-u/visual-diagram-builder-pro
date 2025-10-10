import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, role } = useAuth();
  const nav = useNavigate();
  async function doLogout() { await signOut(auth); nav('/login'); }
  return (
    <div style={{padding:20}}>
      <h3>Profile</h3>
      <div>Email: {user?.email}</div>
      <div>Role: {role}</div>
      <button onClick={doLogout}>Logout</button>
    </div>
  );
}
