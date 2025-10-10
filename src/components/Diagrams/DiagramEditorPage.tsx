import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlowProvider,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  useReactFlow,
   Handle, 
   Position
} from "reactflow";

import "reactflow/dist/style.css";
import { collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import SidebarToolbox from "./SidebarToolbox";
import { Navigate, useParams } from "react-router-dom";

// 🔹 Editable Node Component
const EditableNode = ({ data, selected }: any) => {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || "");

  const shapeStyles: any = {
    rectangle: { borderRadius: 6 },
    circle: { borderRadius: "50%" },
    diamond: { transform: "rotate(45deg)" },
    
  };

  return (
    <div
      style={{
        padding: 8,
        border: selected ? "2px solid #007bff" : "1px solid #999",
        background: data.color || "#fff",
        minWidth: 100,
        minHeight: 50,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        ...shapeStyles[data.shape || "rectangle"],
      }}
      onDoubleClick={() => setEditing(true)}
    >

      <Handle type="target" position={Position.Top} style={{ background: "#555" }} />

      {editing ? (
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => {
            data.label = label;
            setEditing(false);
          }}
          autoFocus
          style={{ width: "90%", border: "1px solid #ccc", borderRadius: 4 }}
        />
      ) : (
        <div style={{ transform: data.shape === "diamond" ? "rotate(-45deg)" : "none" }}>
          {label || "Unnamed Node"}
        </div>
      )}
      {/* 🔹 Bottom handle (for outgoing edges) */}
      <Handle type="source" position={Position.Bottom} style={{ background: "#555" }} />
    </div>
  );
};

const DiagramCanvas: React.FC = () => {
  const { user, loading, role } = useAuth();
  const isEditable = role === "editor";
  const { id } = useParams();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    target: Node | Edge | null;
  } | null>(null);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // 🔹 Load Diagram
  useEffect(() => {
    const loadDiagram = async () => {
      if (!id || id === "new") return;
      try {
        const ref = doc(db, "diagrams", id);
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
  }, [id]);

  // 🔹 Node & Edge Change Handlers
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // 🔹 Connect nodes
  const onConnect = useCallback(
    (params: Connection) => isEditable && setEdges((eds) => addEdge(params, eds)),
    [isEditable]
  );

  // 🔹 Drag & Drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

const onDrop = useCallback(
  (event: React.DragEvent) => {
    if (!isEditable) return;
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    if (!type) return;

    const position = project({
      x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left || 0),
      y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top || 0),
    });

    // Set color & shape based on type
    const shapeMap: any = {
      rectangle: { shape: "rectangle", color: "#a2d2ff" },
      circle: { shape: "circle", color: "#ffafcc" },
      diamond: { shape: "diamond", color: "#b5ead7" },
      triangle: { shape: "triangle", color: "#455fe4ff" },
    };

    const newNode: Node = {
      id: `${+new Date()}`,
      type: "editableNode",
      position,
      data: {
        label: `${type} node`,
        ...shapeMap[type],
      },
    };
    setNodes((nds) => nds.concat(newNode));
  },
  [isEditable]
);


  // 🔹 Handle Right Click
  const handlePaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(null); // close if clicking on empty space
  }, []);

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      if (!isEditable) return;
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        target: node,
      });
    },
    [isEditable]
  );

  const handleEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (!isEditable) return;
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        target: edge,
      });
    },
    [isEditable]
  );

  const handleDelete = useCallback(() => {
    if (!contextMenu?.target) return;

    if ("source" in contextMenu.target) {
      setEdges((eds) => eds.filter((e) => e.id !== contextMenu.target!.id));
    } else {
      setNodes((nds) => nds.filter((n) => n.id !== contextMenu.target!.id));
      setEdges((eds) =>
        eds.filter(
          (e) =>
            e.source !== contextMenu.target!.id &&
            e.target !== contextMenu.target!.id
        )
      );
    }
    setContextMenu(null);
  }, [contextMenu]);

  const handleEditLabel = useCallback(() => {
    if (!contextMenu?.target) return;

    const newLabel = prompt("Enter new label:");
    if (!newLabel) return;

    if ("source" in contextMenu.target) {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === contextMenu.target!.id ? { ...e, label: newLabel } : e
        )
      );
    } else {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === contextMenu.target!.id
            ? { ...n, data: { ...n.data, label: newLabel } }
            : n
        )
      );
    }
    setContextMenu(null);
  }, [contextMenu]);

  // 🔹 Save diagram to Firestore
  const saveDiagram = useCallback(async () => {
    if (!isEditable) return;
    try {
      const diagramsRef = collection(db, "diagrams");
      if (id && id !== "new") {
        await setDoc(
          doc(diagramsRef, id),
          { nodes, edges, updatedAt: new Date() },
          { merge: true }
        );
        alert("Diagram updated!");
      } else {
        const newDoc = await addDoc(diagramsRef, {
          nodes,
          edges,
          ownerId: user.uid,
          createdAt: new Date(),
        });
        alert(`Diagram saved! (ID: ${newDoc.id})`);
      }
    } catch (err) {
      console.error("Error saving diagram:", err);
      alert("Failed to save diagram");
    }
  }, [nodes, edges, user, id, isEditable]);

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      <SidebarToolbox
        saveDiagram={saveDiagram}
        onDragStart={(e, nodeType) => {
          e.dataTransfer.setData("application/reactflow", nodeType);
          e.dataTransfer.effectAllowed = "move";
        }}
        isEditable={isEditable}
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
          onNodeContextMenu={handleNodeContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
          onPaneContextMenu={handlePaneContextMenu}
          fitView
          nodesDraggable={isEditable}
          nodesConnectable={isEditable}
          elementsSelectable={isEditable}
          nodeTypes={{ editableNode: EditableNode }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>

        {contextMenu && (
          <div
            style={{
              position: "absolute",
              top: contextMenu.y,
              left: contextMenu.x,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "6px",
              zIndex: 1000,
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
            onMouseLeave={() => setContextMenu(null)}
          >
            <button
              onClick={handleEditLabel}
              style={{
                display: "block",
                width: "100%",
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              ✏️ Edit Label
            </button>
            <button
              onClick={handleDelete}
              style={{
                display: "block",
                width: "100%",
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "6px 12px",
                cursor: "pointer",
                color: "red",
              }}
            >
              🗑️ Delete
            </button>
          </div>
        )}
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
