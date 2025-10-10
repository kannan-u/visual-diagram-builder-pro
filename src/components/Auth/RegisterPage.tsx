import React, { useState, CSSProperties } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getNextUserId } from "../../services/firestoreHelpers"; // your existing file

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      // 1️⃣ Create user in Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);
   //   const userId = await getNextUserId();

        // 2️⃣ Create user document in Firestore under /users/{uid}
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
      //  userId, // sequential ID
        email,
        role,
        createdAt: new Date(),
      });

      alert("Account created successfully!");
      nav("/login");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}
        <form onSubmit={handleRegister} style={styles.form}>
          <label style={styles.label}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "editor" | "viewer")}
            style={styles.input}
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <button onClick={() => nav("/login")} style={styles.linkButton}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f6fa",
  },
  card: {
    width: 350,
    padding: 30,
    borderRadius: 10,
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: "#555",
  },
  input: {
    padding: "10px 12px",
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 5,
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: 15,
    cursor: "pointer",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    fontSize: 14,
    marginTop: 15,
    cursor: "pointer",
    textAlign: "center",
    width: "100%",
  },
};
