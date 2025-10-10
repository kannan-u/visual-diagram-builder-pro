import React, { useState } from "react";
import { db } from "../../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../../hooks/useAuth";

interface InviteUserProps {
  onInviteSuccess?: () => void;
}

const InviteUser: React.FC<InviteUserProps> = ({ onInviteSuccess }) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!user) return;
    if (!email) {
      alert("Please enter an email");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "users"), {
        email,
        role,
        invitedBy: user.uid,
        createdAt: serverTimestamp(),
      });
      alert(`Invitation sent to ${email} as ${role}`);
      setEmail("");
      setRole("viewer");
      if (onInviteSuccess) onInviteSuccess();
    } catch (err) {
      console.error("Failed to send invite:", err);
      alert("Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Invite User</h3>
      <input
        type="email"
        placeholder="User email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: 10, padding: 6 }}
      />
      <select value={role} onChange={(e) => setRole(e.target.value as "editor" | "viewer")}>
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
      </select>
      <button onClick={handleInvite} disabled={loading} style={{ marginLeft: 10, padding: "6px 12px" }}>
        {loading ? "Inviting..." : "Invite"}
      </button>
    </div>
  );
};

export default InviteUser;
