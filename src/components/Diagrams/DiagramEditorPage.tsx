import React, { useCallback, useRef, useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import SidebarToolbox from "./SidebarToolbox";
import { Navigate, useParams } from "react-router-dom";

const DiagramCanvas: React.FC = () => {
  const { user, loading, role } = useAuth();
  const isEditable = role === "editor";
  const { id } = useParams();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { project } = useReactFlow();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // Load existing diagram
  useEffect(() => {
    const loadDiagram = async () => {
      if (!id || id === "new") return;
      try {
        const ref = doc(db, "users", user.uid, "diagrams", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
        }
      } catch (err) {
        console.error("Error loading diagram:", err);
      }
    };
    loadDiagram();
  }, [id, user]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: any) => {
      if (!isEditable) return;
      setEdges((eds) => addEdge(params, eds));
    },
    [isEditable]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      if (!isEditable) return; // viewers can't drop
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = project({
        x:
          event.clientX -
          (reactFlowWrapper.current?.getBoundingClientRect().left || 0),
        y:
          event.clientY -
          (reactFlowWrapper.current?.getBoundingClientRect().top || 0),
      });

      const newNode: Node = {
        id: `${+new Date()}`,
        type: "default",
        position,
        data: { label: `${type} node` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [isEditable]
  );

  const saveDiagram = useCallback(async () => {
    if (!isEditable) return;
    try {
      const diagramsRef = collection(db, "users", user.uid, "diagrams");
      if (id && id !== "new") {
        const ref = doc(diagramsRef, id);
        await setDoc(
          ref,
          { nodes, edges, updatedAt: new Date() },
          { merge: true }
        );
        alert("Diagram updated!");
      } else {
        const newDoc = await addDoc(diagramsRef, {
          nodes,
          edges,
          createdAt: new Date(),
        });
        alert(`Diagram saved! (ID: ${newDoc.id})`);
      }
    } catch (err) {
      console.error("Error saving diagram:", err);
      alert("Failed to save diagram");
    }
  }, [nodes, edges, user, id]);

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      <SidebarToolbox
        saveDiagram={saveDiagram}
        onDragStart={(e, nodeType) => {
          e.dataTransfer.setData("application/reactflow", nodeType);
          e.dataTransfer.effectAllowed = "move";
        }}
        isEditable={role === "editor"}
      />
      <div
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
        style={{ flex: 1, border: "1px solid #ccc" }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={isEditable ? onNodesChange : undefined}
          onEdgesChange={isEditable ? onEdgesChange : undefined}
          onConnect={isEditable ? onConnect : undefined}
          fitView
          nodesDraggable={isEditable}
          nodesConnectable={isEditable}
          elementsSelectable={isEditable}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

const DiagramEditorPage: React.FC = () => (
  <ReactFlowProvider>
    <DiagramCanvas />
  </ReactFlowProvider>
);

export default DiagramEditorPage;
