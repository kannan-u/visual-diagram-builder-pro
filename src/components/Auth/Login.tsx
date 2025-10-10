import React, { useState, CSSProperties } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const nav = useNavigate();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", cred.user.uid), { email, role: role });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      nav("/dashboardPage");
    } catch (err) {
       if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(String(err));
      }
   }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isRegister ? "Create Account" : "Login"}</h2>
        <form onSubmit={submit} style={styles.form}>
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
            {isRegister ? "Sign Up" : "Login"}
          </button>
        </form>

        <button onClick={() => setIsRegister((s) => !s)} style={styles.linkButton}>
          {isRegister ? "Already have an account? Login" : "Create a new account"}
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties }  = {
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
