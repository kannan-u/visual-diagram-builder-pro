import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";

type Diagram = {
  id: string;
  name: string;
  createdAt: any;
  updatedAt?: any;
};

const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loadingDiagrams, setLoadingDiagrams] = useState(true);
  const [sortAsc, setSortAsc] = useState(false);
  const navigate = useNavigate();

  const fetchDiagrams = async () => {
    setLoadingDiagrams(true);
    try {
      const snapshot = await getDocs(collection(db, "users", user!.uid, "diagrams"));
      const diagramsData: Diagram[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: (doc.data() as any).name || "Untitled Diagram",
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
    return sortAsc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  const handleCreateNew = () => navigate("/diagram/new");
  const handleOpenDiagram = (diagramId: string) => navigate(`/diagram/${diagramId}`);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Your Diagrams</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            style={{
              padding: "6px 10px",
              fontSize: 14,
              borderRadius: 6,
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Sort by Date {sortAsc ? "↑" : "↓"}
          </button>
          <button
            onClick={handleCreateNew}
            style={{
              padding: "10px 16px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "6px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            + Create New Diagram
          </button>
        </div>
      </div>

      {loadingDiagrams && <p>Loading diagrams...</p>}
      {!loadingDiagrams && diagrams.length === 0 && <p>No diagrams found. Click above to create one!</p>}

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
              border: "1px solid #ccc",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
              transition: "0.2s",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
            <div style={{ fontWeight: "bold", marginBottom: 4, textAlign: "center" }}>{diagram.name}</div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
              Created: {diagram.createdAt.toLocaleDateString()}
            </div>
            <div style={{ fontSize: 12, color: "#777" }}>ID: {diagram.id.slice(0, 6)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
