import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where, DocumentData } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Diagram {
  id: string;
  name?: string;
  owner: string;
  nodes: unknown[];
  edges: unknown[];
  createdAt: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagrams = async () => {
      if (!user) return;
      const q = query(collection(db, "diagrams"), where("owner", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as DocumentData),
      })) as Diagram[];
      setDiagrams(data);
    };
    fetchDiagrams();
  }, [user]);

  const createDiagram = async () => {
    if (!user) return;
    const docRef = await addDoc(collection(db, "diagrams"), {
      owner: user.uid,
      nodes: [],
      edges: [],
      createdAt: Date.now(),
    });
    navigate(`/diagram/${docRef.id}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Diagrams</h2>
      <button onClick={createDiagram}>Create New Diagram</button>
      <ul>
        {diagrams.map((d) => (
          <li key={d.id}>
            <button onClick={() => navigate(`/diagram/${d.id}`)}>
              {d.name || "Untitled Diagram"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
