import React, { CSSProperties } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, role } = useAuth();
  const nav = useNavigate();

  async function doLogout() {
    await signOut(auth);
    nav('/login');
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Profile</h2>
        <div style={styles.info}><strong>Email:</strong> {user?.email}</div>
        <div style={styles.info}><strong>Role:</strong> {role}</div>
        <button style={styles.button} onClick={doLogout}>Logout</button>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 50, // Align card at the top with some spacing
    background: "#f5f6fa",
    minHeight: "100vh",
  },
  card: {
    width: 350,
    padding: 30,
    borderRadius: 10,
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  info: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    marginTop: 20,
    padding: "10px 12px",
    borderRadius: 5,
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: 15,
    cursor: "pointer",
  },
};
