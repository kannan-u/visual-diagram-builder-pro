import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import InviteUser from "./InviteUser/InviteUser";

type Diagram = {
  id: string;
  name: string;
  ownerId: string;
  email: string
  createdAt: any;
  updatedAt?: any;
};

const DashboardPage: React.FC = () => {
  const { user, role, loading } = useAuth(); // role from useAuth
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loadingDiagrams, setLoadingDiagrams] = useState(true);
  const [sortAsc, setSortAsc] = useState(false);
  const navigate = useNavigate();

  const fetchDiagrams = async () => {
    setLoadingDiagrams(true);
    try {
      const snapshot = await getDocs(collection(db, "diagrams")); // global collection
      const diagramsData: Diagram[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: (doc.data() as any).name || "Untitled Diagram",
        ownerId: (doc.data() as any).ownerId,
        email: (doc.data() as any).email,
        createdAt: (doc.data() as any).createdAt?.toDate() || new Date(),
        updatedAt: (doc.data() as any).updatedAt?.toDate(),
      }));
      setDiagrams(diagramsData);
    } catch (err) {
      console.error("Failed to load diagrams:", err);
    } finally {
      setLoadingDiagrams(false);
    }
  };

  useEffect(() => {
    if (user) fetchDiagrams();
  }, [user]);

  if (loading) return <div>Loading authentication...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const sortedDiagrams = [...diagrams].sort((a, b) => {
    const dateA = a.updatedAt || a.createdAt;
    const dateB = b.updatedAt || b.createdAt;
    return sortAsc
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });

  const handleCreateNew = async () => {
    let diagramName = prompt("Enter a name for the new diagram:");
    if (!diagramName || diagramName.trim() === "") {
      diagramName = "Untitled Diagram"; // fallback
    }

    // Create a new document in Firestore
    try {
      const docRef = await addDoc(collection(db, "diagrams"), {
        name: diagramName,
        ownerId: user?.uid,
        email: user?.email,
        createdAt: new Date(),
        updatedAt: null,
      });
      navigate(`/diagram/${docRef.id}`); // redirect to the new diagram
    } catch (err) {
      console.error("Failed to create new diagram:", err);
      alert("Failed to create diagram");
    }
  };

  const handleOpenDiagram = (diagramId: string) =>
    navigate(`/diagram/${diagramId}`);

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>All Diagrams</h2>
        {role === "editor" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            <InviteUser onInviteSuccess={fetchDiagrams} />
            <button
              onClick={handleCreateNew}
              style={{
                padding: "10px 16px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: 6,
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              + Create New Diagram
            </button>
          </div>
        )}
      </div>

      {loadingDiagrams && <p>Loading diagrams...</p>}
      {!loadingDiagrams && diagrams.length === 0 && <p>No diagrams found.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {sortedDiagrams.map((diagram) => (
          <div
            key={diagram.id}
            onClick={() => handleOpenDiagram(diagram.id)}
            style={{
              padding: 16,
              border: "1px solid #0b70a6ff",
              borderRadius: 8,
              cursor: role === "editor" ? "pointer" : "default",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#c1c3d8ff",
              transition: "0.2s",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              {diagram.name}
            </div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
              Created: {diagram.createdAt.toLocaleDateString()}
            </div>
            <div style={{ fontSize: 12, color: "#777" }}>
              Owner: {diagram.email}
            </div>
            {role === "viewer" && (
              <div style={{ fontSize: 12, color: "#f00", marginTop: 4 }}>
                Read-only
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
